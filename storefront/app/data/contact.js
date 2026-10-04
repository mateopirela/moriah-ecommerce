/**
 * MORIAH — datos de contacto de la marca.
 *
 * Fuente única para el footer, el checkout y cualquier enlace de soporte.
 * Antes el footer mostraba "+57 300 000 0000" con `tel:+57` y un WhatsApp
 * apuntando a `wa.me/57` (número inválido: WhatsApp rechaza el enlace).
 *
 * Si algún día se vacían, el sitio no pinta enlaces rotos: oculta el teléfono
 * y usa el correo como canal de contacto.
 */

/** Teléfono en formato E.164, sin espacios. */
const PHONE_E164 = '+573019211731';

/** Número de WhatsApp sin '+' ni espacios. */
const WHATSAPP_NUMBER = '573019211731';

export const CONTACT = {
  /** Formato legible para humanos; se deriva del E.164 si no se define. */
  phoneDisplay: PHONE_E164 ? formatPhone(PHONE_E164) : null,
  phoneHref: PHONE_E164 ? `tel:${PHONE_E164}` : null,
  email: 'cafemoriahshop@gmail.com',
  emailHref: 'mailto:cafemoriahshop@gmail.com',
  city: 'Bogotá · Colombia',
  instagram: 'https://www.instagram.com/_cafemoriah/',
  facebook: 'https://facebook.com/cafemoriah',
  /** true cuando hay un WhatsApp real configurado. */
  hasWhatsapp: Boolean(WHATSAPP_NUMBER),
};

/**
 * Enlace de WhatsApp con mensaje prellenado. Si no hay número configurado
 * devuelve el correo, para no dejar nunca un enlace muerto.
 * @param {string} [message]
 */
export function whatsappUrl(message = 'Hola MORIAH, quiero hacer un pedido.') {
  if (!WHATSAPP_NUMBER) return CONTACT.emailHref;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** '+573001234567' → '+57 300 123 4567' */
function formatPhone(e164) {
  const digits = e164.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('57')) {
    return `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return e164;
}
