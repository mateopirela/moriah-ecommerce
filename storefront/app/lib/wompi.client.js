/**
 * Tokenización de tarjetas en el navegador (llave pública de Wompi).
 * El número/CVC nunca pasan por nuestro servidor: van directo a Wompi y
 * recibimos un token de un solo uso con el que el servidor crea la fuente de pago.
 */

/** @param {string} publicKey */
export function wompiApiBase(publicKey) {
  return /^pub_test_/.test(publicKey ?? '')
    ? 'https://sandbox.wompi.co/v1'
    : 'https://production.wompi.co/v1';
}

/**
 * @param {{
 *   publicKey: string, number: string, cvc: string,
 *   expMonth: string, expYear: string, cardHolder: string,
 * }} card
 * @returns {Promise<{id: string, brand?: string, lastFour?: string, expMonth?: string, expYear?: string}>}
 */
export async function tokenizeCard(card) {
  const response = await fetch(`${wompiApiBase(card.publicKey)}/tokens/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${card.publicKey}`,
    },
    body: JSON.stringify({
      number: card.number.replace(/\s+/g, ''),
      cvc: card.cvc,
      exp_month: card.expMonth.padStart(2, '0'),
      exp_year: card.expYear.slice(-2),
      card_holder: card.cardHolder,
    }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json?.data?.id) {
    const messages = json?.error?.messages;
    const detail = messages
      ? Object.values(messages).flat().join(' ')
      : json?.error?.reason || 'No pudimos validar la tarjeta.';
    throw new Error(detail);
  }
  return {
    id: json.data.id,
    brand: json.data.brand,
    lastFour: json.data.last_four,
    expMonth: json.data.exp_month,
    expYear: json.data.exp_year,
  };
}
