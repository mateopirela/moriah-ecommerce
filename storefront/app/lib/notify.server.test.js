import {afterEach, describe, expect, it, vi} from 'vitest';
import {checkAdminPassword} from './admin.server';
import {orderPaidEmail} from './notify.server';

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
