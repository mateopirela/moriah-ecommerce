import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';

process.env.SESSION_SECRET ??= 'test-secret';
process.env.KLAVIYO_PRIVATE_KEY = '';
process.env.RESEND_API_KEY = 're_test';
process.env.ORDER_NOTIFY_EMAIL = 'tienda@example.com';
process.env.EMAIL_FROM = 'MORIAH Café <pedidos@cafemoriah.com>';
process.env.PUBLIC_SITE_URL = 'https://www.cafemoriah.com';

const {__setDbForTests} = await import('~/db/client.server');
const schema = await import('~/db/schema');
const {applyTransactionToOrder, shipOrder} = await import('~/lib/orders.server');

let db;
let fetchMock;
let order;

/** Lo que recibió Resend, con la llave de idempotencia de cada envío. */
const sentEmails = () =>
  fetchMock.mock.calls.map(([url, init]) => ({
    url,
    key: init.headers['Idempotency-Key'],
    ...JSON.parse(init.body),
  }));

beforeAll(async () => {
  const [{PGlite}, {drizzle}, {migrate}] = await Promise.all([
    import('@electric-sql/pglite'),
    import('drizzle-orm/pglite'),
    import('drizzle-orm/pglite/migrator'),
  ]);
  db = drizzle({client: new PGlite(), schema});
  await migrate(db, {migrationsFolder: './drizzle'});
  __setDbForTests(db);
});

beforeEach(async () => {
  fetchMock = vi.fn(async () => new Response('{"id":"1"}', {status: 200}));
  vi.stubGlobal('fetch', fetchMock);
  const [customer] = await db
    .insert(schema.customers)
    .values({email: `ana-${Date.now()}-${Math.random()}@example.com`, name: 'Ana Pérez'})
    .returning();
  [order] = await db
    .insert(schema.orders)
    .values({
      reference: `MOR-${Date.now()}-${Math.random()}`,
      customerId: customer.id,
      amountCents: 5700000,
      shippingCents: 1200000,
      items: [{title: 'Caturra', quantity: 1, totalPrice: 45000, options: []}],
      shipping: {name: 'Ana Pérez', address: 'Calle 10', city: 'Medellín', region: 'Antioquia'},
    })
    .returning();
});

describe('correos del pedido', () => {
  it('un pago aprobado le escribe al cliente y a la tienda una sola vez', async () => {
    const tx = {id: 'tx-1', status: 'APPROVED'};
    const {order: paid} = await applyTransactionToOrder(db, order, tx);
    await applyTransactionToOrder(db, paid, tx);

    const emails = sentEmails();
    expect(emails).toHaveLength(2);
    const toCustomer = emails.find((e) => e.key.startsWith('order-confirmation/'));
    expect(toCustomer.url).toBe('https://api.resend.com/emails');
    expect(toCustomer.from).toBe('MORIAH Café <pedidos@cafemoriah.com>');
    expect(toCustomer.reply_to).toBe('cafemoriahshop@gmail.com');
    const toStore = emails.find((e) => e.key.startsWith('order-paid/'));
    expect(toStore.to).toEqual(['tienda@example.com']);
  });

  it('si Resend falla el pago se registra igual', async () => {
    fetchMock.mockResolvedValue(new Response('boom', {status: 500}));
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
    const {order: paid} = await applyTransactionToOrder(db, order, {id: 'tx-2', status: 'APPROVED'});
    expect(paid.status).toBe('approved');
    errorLog.mockRestore();
  });

  it('un pago pendiente que termina rechazado le avisa al cliente', async () => {
    await applyTransactionToOrder(db, order, {id: 'tx-3', status: 'DECLINED'});
    const emails = sentEmails();
    expect(emails).toHaveLength(1);
    expect(emails[0].key).toMatch(/^order-payment-failed\//);
    expect(emails[0].text).toContain('https://www.cafemoriah.com/collections/cafes');
  });

  it('un rechazo de suscripción no usa el correo del pedido', async () => {
    await applyTransactionToOrder(db, {...order, subscriptionId: null}, {id: 'tx-4', status: 'PENDING'});
    fetchMock.mockClear();
    const {eq} = await import('drizzle-orm');
    const [sub] = await db
      .update(schema.orders)
      .set({subscriptionId: '00000000-0000-0000-0000-000000000000'})
      .where(eq(schema.orders.id, order.id))
      .returning();
    await applyTransactionToOrder(db, sub, {id: 'tx-4', status: 'DECLINED'});
    expect(sentEmails()).toHaveLength(0);
  });

  it('marcar como enviado manda la guía una sola vez', async () => {
    const {order: paid} = await applyTransactionToOrder(db, order, {id: 'tx-5', status: 'APPROVED'});
    fetchMock.mockClear();

    const first = await shipOrder(db, paid.id, 'Servientrega 123');
    const second = await shipOrder(db, paid.id, 'Servientrega 123');

    expect(first.emailSent).toBe(true);
    expect(first.order.tracking).toBe('Servientrega 123');
    expect(second.order).toBeNull();
    const emails = sentEmails();
    expect(emails).toHaveLength(1);
    expect(emails[0].text).toContain('Guía de envío: Servientrega 123');
  });

  it('no despacha un pedido sin pagar', async () => {
    const {order: shipped} = await shipOrder(db, order.id, '');
    expect(shipped).toBeNull();
    expect(sentEmails()).toHaveLength(0);
  });

  it('el panel se entera si el correo de envío falló', async () => {
    const {order: paid} = await applyTransactionToOrder(db, order, {id: 'tx-6', status: 'APPROVED'});
    fetchMock.mockResolvedValue(new Response('boom', {status: 500}));
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
    const {order: shipped, emailSent} = await shipOrder(db, paid.id, '');
    expect(shipped.fulfilledAt).toBeTruthy();
    expect(emailSent).toBe(false);
    errorLog.mockRestore();
  });
});
