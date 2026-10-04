import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {eq} from 'drizzle-orm';

process.env.SESSION_SECRET ??= 'test-secret';
process.env.KLAVIYO_PRIVATE_KEY = '';

// Wompi se simula: nunca salimos a la red en los tests.
vi.mock('~/lib/wompi.server', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    chargePaymentSource: vi.fn(),
    waitForTransaction: vi.fn(async (id) => ({id, status: 'APPROVED'})),
    getTransaction: vi.fn(),
  };
});

const {__setDbForTests} = await import('~/db/client.server');
const schema = await import('~/db/schema');
const wompi = await import('~/lib/wompi.server');
const {upsertCustomer, applyTransactionToOrder, transactionMatchesOrder} = await import('~/lib/orders.server');
const {
  addDays,
  chargeDueSubscriptions,
  chargeSubscription,
  createSubscription,
  manageSubscription,
  reconcileSubscriptionCharge,
  MAX_FAILED_ATTEMPTS,
} = await import('~/lib/subscriptions.server');

let db;

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
  vi.clearAllMocks();
  for (const table of [schema.orders, schema.subscriptions, schema.paymentSources, schema.customers]) {
    await db.delete(table);
  }
});

const shipping = {
  name: 'Ana Pérez',
  phone: '3001234567',
  address: 'Calle 1 # 2-3',
  address2: null,
  city: 'Bogotá',
  region: 'Bogotá D.C.',
  country: 'CO',
};

async function seedSubscription(overrides = {}) {
  const customer = await upsertCustomer(db, {email: 'ana@test.co', name: 'Ana Pérez', phone: '3001234567'});
  const {subscription} = await createSubscription(db, {
    customer,
    paymentSource: {wompiPaymentSourceId: 3891, brand: 'VISA', lastFour: '4242'},
    cafeHandle: 'bourbon-rosado',
    sizeLabel: '250 g',
    grind: 'Grano entero',
    quantity: 1,
    frequencyDays: 28,
    shipping,
    ...overrides,
  });
  return {customer, subscription};
}

describe('createSubscription', () => {
  it('stores the payment source and prices the subscription with the Club discount', async () => {
    const {subscription} = await seedSubscription();
    expect(subscription.status).toBe('active');
    expect(subscription.unitPriceCents).toBe(38300 * 100);
    expect(subscription.amountCents).toBe((38300 + 12000) * 100);
    expect(subscription.manageToken).toHaveLength(48);
  });

  it('upserts customers by email', async () => {
    const a = await upsertCustomer(db, {email: 'Ana@Test.co', name: 'Ana'});
    const b = await upsertCustomer(db, {email: 'ana@test.co', name: 'Ana Pérez', phone: '300'});
    expect(a.id).toBe(b.id);
    expect(b.name).toBe('Ana Pérez');
  });
});

describe('chargeSubscription', () => {
  it('creates an approved order and schedules the next charge', async () => {
    const now = new Date('2026-09-01T12:00:00Z');
    wompi.chargePaymentSource.mockResolvedValue({id: 'tx-1', status: 'PENDING'});
    const {subscription} = await seedSubscription();

    const result = await chargeSubscription(db, subscription, {now, wait: true});

    expect(wompi.chargePaymentSource).toHaveBeenCalledWith(
      expect.objectContaining({
        amountInCents: subscription.amountCents,
        paymentSourceId: 3891,
        customerEmail: 'ana@test.co',
      }),
    );
    expect(result.order.status).toBe('approved');
    expect(result.order.reference).toMatch(/^SUB-/);
    expect(result.subscription.status).toBe('active');
    expect(result.subscription.failedAttempts).toBe(0);
    expect(result.subscription.nextChargeAt.toISOString()).toBe(addDays(now, 28).toISOString());
  });

  it('retries in two days after a decline and pauses as past_due after 3 failures', async () => {
    const now = new Date('2026-09-01T12:00:00Z');
    wompi.chargePaymentSource.mockResolvedValue({id: 'tx-d', status: 'DECLINED'});
    let {subscription} = await seedSubscription();

    for (let i = 1; i <= MAX_FAILED_ATTEMPTS; i++) {
      const result = await chargeSubscription(db, subscription, {now});
      expect(result.order.status).toBe('declined');
      subscription = result.subscription;
      expect(subscription.failedAttempts).toBe(i);
      if (i < MAX_FAILED_ATTEMPTS) {
        expect(subscription.status).toBe('active');
        expect(subscription.nextChargeAt.toISOString()).toBe(addDays(now, 2).toISOString());
      }
    }
    expect(subscription.status).toBe('past_due');
    // El cron no vuelve a intentar suscripciones past_due (requieren acción del cliente).
    const summary = await chargeDueSubscriptions(db, addDays(now, 30));
    expect(summary.checked).toBe(0);
    // Una suscripción cancelada nunca se cobra.
    const cancelled = await manageSubscription(db, subscription, 'cancel', {now});
    expect(await chargeSubscription(db, cancelled, {now})).toMatchObject({skipped: 'status'});
  });

  it('records an error order when Wompi is unreachable', async () => {
    wompi.chargePaymentSource.mockRejectedValue(new Error('network down'));
    const {subscription} = await seedSubscription();
    const result = await chargeSubscription(db, subscription, {now: new Date()});
    expect(result.order.status).toBe('error');
    expect(result.subscription.failedAttempts).toBe(1);
  });

  it('does not double charge while a recent order is still pending', async () => {
    wompi.chargePaymentSource.mockResolvedValue({id: 'tx-p', status: 'PENDING'});
    const {subscription} = await seedSubscription();
    const first = await chargeSubscription(db, subscription, {now: new Date()});
    expect(first.order.status).toBe('pending');
    const second = await chargeSubscription(db, first.subscription, {now: new Date()});
    expect(second.skipped).toBe('pending');
    expect(wompi.chargePaymentSource).toHaveBeenCalledTimes(1);
  });

  it('lets the webhook resolve a pending charge', async () => {
    const now = new Date('2026-09-01T12:00:00Z');
    wompi.chargePaymentSource.mockResolvedValue({id: 'tx-w', status: 'PENDING'});
    const {subscription} = await seedSubscription();
    const {order} = await chargeSubscription(db, subscription, {now});

    const tx = {id: 'tx-w', status: 'APPROVED', reference: order.reference, amount_in_cents: order.amountCents, currency: 'COP'};
    expect(transactionMatchesOrder(order, tx)).toBe(true);
    expect(transactionMatchesOrder(order, {...tx, amount_in_cents: 1})).toBe(false);

    const {order: updated, changed} = await applyTransactionToOrder(db, order, tx);
    expect(changed).toBe(true);
    expect(updated.status).toBe('approved');
    const sub = await reconcileSubscriptionCharge(db, subscription, updated, {now});
    expect(sub.nextChargeAt.toISOString()).toBe(addDays(now, 28).toISOString());

    // Re-delivery of the same event is a no-op.
    const again = await applyTransactionToOrder(db, updated, tx);
    expect(again.changed).toBe(false);
  });
});

describe('chargeDueSubscriptions', () => {
  it('only charges active subscriptions whose date has come', async () => {
    const now = new Date('2026-09-10T12:00:00Z');
    wompi.chargePaymentSource.mockResolvedValue({id: 'tx-due', status: 'APPROVED'});
    const {subscription: due} = await seedSubscription();
    const {subscription: future} = await seedSubscription({frequencyDays: 14});
    await db
      .update(schema.subscriptions)
      .set({nextChargeAt: addDays(now, 5)})
      .where(eq(schema.subscriptions.id, future.id));
    const {subscription: paused} = await seedSubscription();
    await manageSubscription(db, paused, 'pause', {now});

    const summary = await chargeDueSubscriptions(db, now);
    expect(summary.checked).toBe(1);
    expect(summary.results).toEqual([{id: due.id, status: 'approved'}]);
  });
});

describe('manageSubscription', () => {
  it('pauses, resumes, changes frequency and cancels', async () => {
    const now = new Date('2026-09-01T12:00:00Z');
    const {subscription} = await seedSubscription();

    const paused = await manageSubscription(db, subscription, 'pause', {now});
    expect(paused.status).toBe('paused');

    const resumed = await manageSubscription(db, paused, 'resume', {now});
    expect(resumed.status).toBe('active');
    expect(resumed.nextChargeAt.toISOString()).toBe(addDays(now, 1).toISOString());

    const weekly = await manageSubscription(db, {...resumed, lastChargedAt: now}, 'frequency', {frequencyDays: 14, now});
    expect(weekly.frequencyDays).toBe(14);
    expect(weekly.nextChargeAt.toISOString()).toBe(addDays(now, 14).toISOString());
    const unchanged = await manageSubscription(db, weekly, 'frequency', {frequencyDays: 99, now});
    expect(unchanged.frequencyDays).toBe(14);

    const cancelled = await manageSubscription(db, weekly, 'cancel', {now});
    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.cancelledAt).not.toBeNull();
    expect((await manageSubscription(db, cancelled, 'resume', {now})).status).toBe('cancelled');
  });
});
