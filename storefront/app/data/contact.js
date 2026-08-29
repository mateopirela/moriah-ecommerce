/**
 * MORIAH — datos de contacto de la marca.
 *
 * Fuente única para el footer, el checkout y cualquier enlace de soporte.
 * Antes el footer mostraba "+57 300 000 0000" con `tel:+57` y un WhatsApp
 * apuntando a `wa.me/57` (número inválido: WhatsApp rechaza el enlace).
 *
 * ⚠️ PENDIENTE: reemplaza `phone` y `whatsapp` por el número real de MORIAH.
 * Mientras estén vacíos, el sitio no pinta enlaces rotos: oculta el teléfono y
 * usa el correo como canal de contacto.
 */

/** Teléfono en formato E.164, sin espacios. Ej: '+573001234567' */
const PHONE_E164 = '';

/** Número de WhatsApp sin '+' ni espacios. Ej: '573001234567' */
const WHATSAPP_NUMBER = '';

export const CONTACT = {
  /** Formato legible para humanos; se deriva del E.164 si no se define. */
  phoneDisplay: PHONE_E164 ? formatPhone(PHONE_E164) : null,
  phoneHref: PHONE_E164 ? `tel:${PHONE_E164}` : null,
  email: 'hola@cafemoriah.com',
  emailHref: 'mailto:hola@cafemoriah.com',
  city: 'Bogotá · Colombia',
  instagram: 'https://instagram.com/cafemoriah',
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
