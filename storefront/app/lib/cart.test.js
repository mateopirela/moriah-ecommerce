import {describe, expect, it} from 'vitest';
import {addLine, buildCart, removeLine, sanitizeLines, updateLine, withShipping} from './cart';
import {
  FREE_SHIP_THRESHOLD,
  LOCAL_SHIPPING_FEE,
  SHIPPING_FEE,
  isLocalCity,
  shippingFor,
  getCollection,
  searchProducts,
  subscriptionAmounts,
  unitPrice,
} from './catalog';

describe('cart lines', () => {
  it('adds a café with normalized options and merges duplicates', () => {
    let lines = addLine([], {handle: 'bourbon-rosado', size: '250 g', grind: 'Grano entero', quantity: 1});
    lines = addLine(lines, {handle: 'bourbon-rosado', size: '250 g', grind: 'Grano entero', quantity: 2});
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(3);
    expect(lines[0].size).toBe('250 g');
  });

  it('keeps different options as separate lines and ignores unknown products', () => {
    let lines = addLine([], {handle: 'bourbon-rosado', grind: 'Grano entero'});
    lines = addLine(lines, {handle: 'bourbon-rosado', grind: 'Molida fina (espresso)'});
    lines = addLine(lines, {handle: 'no-existe'});
    expect(lines).toHaveLength(2);
  });

  it('falls back to default options for invalid values', () => {
    const [line] = addLine([], {handle: 'pacamara', size: '9 kg', grind: 'Turbo'});
    expect(line.size).toBe('250 g');
    expect(line.grind).toBe('Grano entero');
  });

  it('updates and removes lines', () => {
    let lines = addLine([], {handle: 'pocillo-de-verdad', quantity: 1});
    const id = lines[0].id;
    lines = updateLine(lines, id, 4);
    expect(lines[0].quantity).toBe(4);
    lines = updateLine(lines, id, 0);
    expect(lines).toHaveLength(0);
    lines = removeLine(addLine([], {handle: 'pacamara'}), 'pacamara|250 g|Grano entero');
    expect(lines).toHaveLength(0);
  });

  it('sanitizes garbage from the cookie', () => {
    expect(sanitizeLines(null)).toEqual([]);
    expect(sanitizeLines([{handle: 'nope', quantity: 2}, {handle: 'pacamara', quantity: 'x'}])).toEqual([
      {id: 'pacamara|250 g|Grano entero', handle: 'pacamara', size: '250 g', grind: 'Grano entero', quantity: 1},
    ]);
  });
});

describe('buildCart totals', () => {
  it('computes prices from the catalog, shipping and free-shipping threshold', () => {
    const cart = buildCart([{handle: 'bourbon-rosado', size: '250 g', grind: 'Grano entero', quantity: 1}]);
    expect(cart.subtotal).toBe(45000);
    expect(cart.shipping).toBe(SHIPPING_FEE);
    expect(cart.total).toBe(45000 + SHIPPING_FEE);
    expect(cart.freeShipRemaining).toBe(FREE_SHIP_THRESHOLD - 45000);

    const big = buildCart([{handle: 'pacamara', size: '250 g', grind: 'Grano entero', quantity: 2}]);
    expect(big.lines[0].unitPrice).toBe(unitPrice('pacamara', {size: '250 g'}));
    expect(big.shipping).toBe(0);
    expect(big.freeShipRemaining).toBe(0);
  });

  it('applies a valid discount code and ignores invalid ones', () => {
    const lines = [{handle: 'bourbon-rosado', size: '250 g', grind: 'Grano entero', quantity: 2}];
    const withCode = buildCart(lines, {discountCode: 'miprimertinto10'});
    expect(withCode.discount).toEqual({code: 'MIPRIMERTINTO10', percent: 10, amount: 9000});
    expect(withCode.total).toBe(90000 - 9000 + SHIPPING_FEE);
    expect(buildCart(lines, {discountCode: 'NADA'}).discount).toBeNull();
    expect(buildCart([], {discountCode: 'MIPRIMERTINTO10'}).discount).toBeNull();
  });

  it('exposes readable options for cafés only', () => {
    const cart = buildCart([
      {handle: 'pacamara', size: '250 g', grind: 'Molida fina (espresso)', quantity: 1},
      {handle: 'tote-bag-abundancia', quantity: 1},
    ]);
    expect(cart.lines[0].options.map((o) => o.value)).toEqual(['250 g', 'Molida fina (espresso)']);
    expect(cart.lines[1].options).toEqual([]);
    expect(cart.totalQuantity).toBe(2);
  });
});

describe('catalog', () => {
  it('prices subscriptions with the Club discount', () => {
    const a = subscriptionAmounts({cafeHandle: 'bourbon-rosado', sizeLabel: '250 g', quantity: 1});
    expect(a.unitPrice).toBe(38300);
    expect(a.shipping).toBe(SHIPPING_FEE);
    expect(a.amountCents).toBe((38300 + SHIPPING_FEE) * 100);
  });

  it('builds collections from the local data', () => {
    expect(getCollection('cafes').products.every((p) => p.kind === 'cafe')).toBe(true);
    expect(getCollection('micro-lotes').products.map((p) => p.handle)).toEqual(['bourbon-rosado', 'pacamara', 'tabi', 'geisha']);
    expect(getCollection('pocillos').products.map((p) => p.handle)).toEqual(['pocillo-de-verdad']);
    expect(getCollection('all').products.length).toBeGreaterThan(5);
    expect(getCollection('nope')).toBeNull();
  });

  it('searches titles first, then notes and descriptions', () => {
    expect(searchProducts('pacamara')[0].handle).toBe('pacamara');
    expect(searchProducts('sedoso').map((p) => p.handle)).toEqual(
      expect.arrayContaining(['bourbon-rosado']),
    );
    expect(searchProducts('')).toEqual([]);
  });
});

describe('shipping by city', () => {
  it('uses the local fee in Barranquilla (any case or accent) and the general fee elsewhere', () => {
    expect(isLocalCity(' Barranquilla ')).toBe(true);
    expect(isLocalCity('BARRANQUILLA')).toBe(true);
    expect(isLocalCity('Bogotá')).toBe(false);
    expect(shippingFor(45000, 'Barranquilla')).toBe(LOCAL_SHIPPING_FEE);
    expect(shippingFor(45000, 'Medellín')).toBe(SHIPPING_FEE);
    expect(shippingFor(FREE_SHIP_THRESHOLD, 'Medellín')).toBe(0);
  });

  it('marks shipping as pending until the city is known, then recalculates the total', () => {
    const lines = addLine([], {handle: 'bourbon-rosado', quantity: 1});
    const cart = buildCart(lines);
    expect(cart.shippingPending).toBe(true);
    const local = withShipping(cart, 'Barranquilla');
    expect(local.shippingPending).toBe(false);
    expect(local.shipping).toBe(LOCAL_SHIPPING_FEE);
    expect(local.total).toBe(cart.subtotal + LOCAL_SHIPPING_FEE);
    expect(withShipping(cart, 'Cali').total).toBe(cart.subtotal + SHIPPING_FEE);
  });

  it('is never pending when the order already ships free', () => {
    const lines = addLine([], {handle: 'pacamara', quantity: 2});
    const cart = buildCart(lines);
    expect(cart.subtotal).toBeGreaterThanOrEqual(FREE_SHIP_THRESHOLD);
    expect(cart.shippingPending).toBe(false);
    expect(cart.shipping).toBe(0);
  });
});
