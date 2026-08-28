/**
 * Códigos de descuento (compras únicas). Se aplican sobre el subtotal del carrito.
 * Las suscripciones ya llevan su −15% y no aceptan códigos adicionales.
 */
export const DISCOUNT_CODES = {
  MIPRIMERTINTO10: {
    percent: 10,
    description: '10% en tu primera compra · #MiPrimerTinto',
  },
};

/** @param {string} code */
export function getDiscount(code) {
  if (!code) return null;
  const key = String(code).trim().toUpperCase();
  const def = DISCOUNT_CODES[key];
  return def ? {code: key, ...def} : null;
}
