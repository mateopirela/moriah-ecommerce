/**
 * Modelo de carrito (puro, sin dependencias de servidor).
 * Las líneas se guardan en una cookie firmada como
 *   {id, handle, size, grind, quantity}
 * y se "hidratan" con el catálogo al leerlas (`buildCart`).
 *
 * @typedef {{
 *   id: string, handle: string, kind: string, title: string, image: string, url: string,
 *   options: Array<{name: string, value: string}>, size: string|null, grind: string|null,
 *   quantity: number, unitPrice: number, totalPrice: number, isOptimistic?: boolean,
 * }} CartLine
 * @typedef {{
 *   lines: CartLine[], totalQuantity: number, subtotal: number, shipping: number,
 *   discount: {code: string, percent: number, amount: number}|null,
 *   total: number, currency: string, freeShipRemaining: number, isOptimistic?: boolean,
 * }} Cart
 */
import {
  CURRENCY,
  FREE_SHIP_THRESHOLD,
  getProduct,
  lineOptions,
  normalizeOptions,
  round100,
  shippingFor,
  unitPrice,
} from '~/lib/catalog';
import {getDiscount} from '~/data/discounts';

export const MAX_QUANTITY = 99;

/** Identificador estable de una línea a partir de su producto + opciones. */
export function lineId({handle, size, grind}) {
  return [handle, size ?? '', grind ?? ''].join('|');
}

/**
 * @param {Array} lines
 * @param {{handle: string, size?: string|null, grind?: string|null, quantity?: number}} input
 */
export function addLine(lines, input) {
  const product = getProduct(input.handle);
  if (!product) return lines;
  const options = normalizeOptions(input.handle, input);
  const quantity = clampQuantity(input.quantity ?? 1);
  if (quantity <= 0) return lines;
  const id = lineId({handle: input.handle, ...options});
  const existing = lines.find((l) => l.id === id);
  if (existing) {
    return lines.map((l) =>
      l.id === id ? {...l, quantity: clampQuantity(l.quantity + quantity)} : l,
    );
  }
  return [...lines, {id, handle: input.handle, ...options, quantity}];
}

/**
 * @param {Array} lines
 * @param {string} id
 * @param {number} quantity
 */
export function updateLine(lines, id, quantity) {
  const q = clampQuantity(quantity);
  if (q <= 0) return removeLine(lines, id);
  return lines.map((l) => (l.id === id ? {...l, quantity: q} : l));
}

/** @param {Array} lines @param {string} id */
export function removeLine(lines, id) {
  return lines.filter((l) => l.id !== id);
}

/** Descarta líneas cuyo producto ya no existe en el catálogo y normaliza opciones. */
export function sanitizeLines(lines) {
  if (!Array.isArray(lines)) return [];
  return lines
    .filter((l) => l && typeof l.handle === 'string' && getProduct(l.handle))
    .map((l) => {
      const options = normalizeOptions(l.handle, l);
      return {
        id: lineId({handle: l.handle, ...options}),
        handle: l.handle,
        ...options,
        quantity: clampQuantity(Number(l.quantity) || 1),
      };
    })
    .filter((l) => l.quantity > 0);
}

/**
 * Carrito listo para la UI y el checkout.
 * @param {Array} rawLines
 * @param {{discountCode?: string|null}} [options]
 * @returns {Cart}
 */
export function buildCart(rawLines, {discountCode, city} = {}) {
  const lines = sanitizeLines(rawLines).map((l) => {
    const product = getProduct(l.handle);
    const price = unitPrice(l.handle, {size: l.size});
    return {
      id: l.id,
      handle: l.handle,
      kind: product.kind,
      title: product.title,
      image: product.image,
      url: `/products/${product.handle}`,
      options: lineOptions(l.handle, l),
      size: l.size,
      grind: l.grind,
      quantity: l.quantity,
      unitPrice: price,
      totalPrice: price * l.quantity,
    };
  });
  const subtotal = lines.reduce((acc, l) => acc + l.totalPrice, 0);
  const shipping = lines.length ? shippingFor(subtotal, city) : 0;
  const discountDef = lines.length ? getDiscount(discountCode) : null;
  const discount = discountDef
    ? {
        code: discountDef.code,
        percent: discountDef.percent,
        amount: round100((subtotal * discountDef.percent) / 100),
      }
    : null;
  const total = Math.max(0, subtotal - (discount?.amount ?? 0) + shipping);
  return {
    lines,
    totalQuantity: lines.reduce((acc, l) => acc + l.quantity, 0),
    subtotal,
    shipping,
    // true mientras no se conoce la ciudad y aún se cobraría envío: la UI no muestra un
    // monto fijo hasta tenerla.
    shippingPending: shipping > 0 && !String(city ?? '').trim(),
    discount,
    total,
    currency: CURRENCY,
    freeShipRemaining: Math.max(0, FREE_SHIP_THRESHOLD - subtotal),
  };
}

/** Líneas listas para persistir en la cookie (sin datos derivados). */
export function toStorage(lines) {
  return sanitizeLines(lines).map(({id, handle, size, grind, quantity}) => ({
    id,
    handle,
    size,
    grind,
    quantity,
  }));
}

function clampQuantity(q) {
  const n = Math.floor(Number(q) || 0);
  return Math.max(0, Math.min(MAX_QUANTITY, n));
}

/**
 * Recalcula envío y total para una ciudad (checkout). No toca el resto del carrito.
 * @param {Cart} cart
 * @param {string} [city]
 */
export function withShipping(cart, city) {
  const shipping = cart.lines.length ? shippingFor(cart.subtotal, city) : 0;
  return {
    ...cart,
    shipping,
    shippingPending: shipping > 0 && !String(city ?? '').trim(),
    total: Math.max(0, cart.subtotal - (cart.discount?.amount ?? 0) + shipping),
  };
}
