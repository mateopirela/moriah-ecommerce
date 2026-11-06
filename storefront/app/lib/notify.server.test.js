import {afterEach, describe, expect, it, vi} from 'vitest';
import {checkAdminPassword} from './admin.server';
import {
  orderConfirmationEmail,
  orderPaidEmail,
  orderPaymentFailedEmail,
  orderShippedEmail,
  subscriptionLinkEmail,
  subscriptionPaymentFailedEmail,
  subscriptionStartedEmail,
  subscriptionStatusEmail,
} from './notify.server';

const order = {
  reference: 'MOR-TEST-1',
  amountCents: 5700000,
  shippingCents: 1200000,
  subscriptionId: null,
  notes: 'Dejar en portería',
  items: [
    {
      title: 'Caturra',
      quantity: 1,
      totalPrice: 45000,
      options: [{name: 'Gramaje', value: '250 g'}, {name: 'Molienda', value: 'Grano entero'}],
    },
  ],
  shipping: {
    name: 'Ana <Pérez>',
    phone: '3001234567',
    address: 'Calle 10 # 20-30',
    address2: null,
    city: 'Medellín',
    region: 'Antioquia',
  },
};
const customer = {email: 'ana@example.com', name: 'Ana', phone: '3001234567'};

describe('correos al cliente', () => {
  it('la confirmación saluda por el nombre y resume el pedido', () => {
    const {subject, text} = orderConfirmationEmail(order, {name: 'Ana María Pérez'});
    expect(subject).toContain('MOR-TEST-1');
    expect(text).toContain('Hola Ana,');
    expect(text).toContain('1 × Caturra (250 g · Grano entero)');
    expect(text).toContain('Calle 10 # 20-30');
  });

  it('escapa en el HTML lo que escribió el cliente', () => {
    const {html} = orderConfirmationEmail(order, customer);
    expect(html).toContain('Ana &lt;Pérez&gt;');
    expect(html).not.toContain('Ana <Pérez>');
  });

  it('el correo de envío trae la guía si la tienda la escribió', () => {
    expect(orderShippedEmail({...order, tracking: 'Servientrega 123'}, customer).text).toContain(
      'Guía de envío: Servientrega 123',
    );
    expect(orderShippedEmail({...order, tracking: null}, customer).text).toContain('escríbenos');
  });

  it('el pago rechazado no muestra el pedido como si fuera a salir', () => {
    const {text} = orderPaymentFailedEmail(order, customer, 'https://x.co/collections/cafes');
    expect(text).toContain('no lo vamos a despachar');
    expect(text).toContain('https://x.co/collections/cafes');
    expect(text).not.toContain('Enviar a');
  });

  it('los correos de suscripción llevan el enlace de gestión', () => {
    const url = 'https://x.co/suscripcion/gestionar?token=abc';
    const sub = {cafeTitle: 'Caturra', frequencyLabel: 'Cada 15 días', amountCents: 4000000};
    expect(subscriptionStartedEmail(sub, customer, url).text).toContain(url);
    expect(subscriptionPaymentFailedEmail({status: 'active'}, customer, url).text).toContain(url);
    expect(subscriptionLinkEmail(customer, [url]).text).toContain(url);
  });

  it('avisa si la suscripción se detuvo y confirma la cancelación sin ofrecer gestionarla', () => {
    const url = 'https://x.co/gestionar';
    expect(subscriptionPaymentFailedEmail({status: 'past_due'}, customer, url).text).toContain('detuvimos');
    const {text} = subscriptionStatusEmail({status: 'cancelled'}, customer, url);
    expect(text).toContain('No haremos más cobros');
    expect(text).not.toContain(url);
  });
});

describe('aviso de pedido pagado', () => {
  it('incluye lo necesario para despachar', () => {
    const {subject, text} = orderPaidEmail(order, customer, 'https://x.co/admin/pedidos');
    expect(subject).toContain('MOR-TEST-1');
    expect(subject).toContain('57.000');
    expect(text).toContain('1 × Caturra (250 g · Grano entero)');
    expect(text).toContain('Calle 10 # 20-30');
    expect(text).toContain('Medellín, Antioquia');
    expect(text).toContain('3001234567');
    expect(text).toContain('Dejar en portería');
    expect(text).toContain('https://x.co/admin/pedidos');
  });

  it('escapa el HTML de los datos del cliente', () => {
    const {html} = orderPaidEmail(order, customer, 'https://x.co/admin/pedidos');
    expect(html).toContain('Ana &lt;Pérez&gt;');
    expect(html).not.toContain('<Pérez>');
  });

  it('distingue los cobros de suscripción', () => {
    const {subject} = orderPaidEmail({...order, subscriptionId: 'sub-1'}, customer, '');
    expect(subject).toMatch(/^Cobro de suscripción pagado/);
  });
});

describe('contraseña del admin', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('acepta solo la contraseña configurada', () => {
    vi.stubEnv('ADMIN_PASSWORD', 'tinto-de-verdad');
    expect(checkAdminPassword('tinto-de-verdad')).toBe(true);
    expect(checkAdminPassword('tinto')).toBe(false);
    expect(checkAdminPassword('')).toBe(false);
  });

  it('rechaza todo si no hay contraseña configurada', () => {
    vi.stubEnv('ADMIN_PASSWORD', '');
    expect(checkAdminPassword('')).toBe(false);
    expect(checkAdminPassword('cualquiera')).toBe(false);
  });
});
