/**
 * Correos transaccionales vía Resend: el aviso interno a la tienda y los correos
 * al cliente (pago, envío y suscripción).
 *
 * Variables: RESEND_API_KEY para enviar y ORDER_NOTIFY_EMAIL (uno o varios correos
 * separados por coma) para el aviso interno. EMAIL_FROM es opcional en el aviso: sin
 * dominio verificado en Resend se usa su remitente de pruebas, que solo entrega al
 * correo dueño de la cuenta. Por eso al cliente solo se le escribe con EMAIL_FROM.
 * Sin esas variables no hace nada.
 */
import {CONTACT} from '~/data/contact';
import {formatCop} from '~/lib/catalog';
import {env, siteUrl} from '~/lib/env.server';

const DEFAULT_FROM = 'MORIAH Pedidos <onboarding@resend.dev>';

/** @param {unknown} value */
function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c],
  );
}

/** @param {any} order */
function orderLines(order) {
  return (order.items ?? []).map((i) => {
    const options = (i.options ?? []).map((o) => o.value).join(' · ');
    return {line: `${i.quantity} × ${i.title}${options ? ` (${options})` : ''}`, total: formatCop(i.totalPrice)};
  });
}

/** @param {any} s */
function addressLines(s) {
  return [s.address, s.address2, `${s.city ?? ''}, ${s.region ?? ''}`].filter(Boolean);
}

/**
 * Asunto y cuerpo del aviso. Puro, para poder probarlo.
 * @param {any} order
 * @param {{email: string, name: string, phone?: string|null}|null} customer
 * @param {string} adminUrl
 */
export function orderPaidEmail(order, customer, adminUrl) {
  const s = order.shipping ?? {};
  const total = formatCop(order.amountCents / 100);
  const items = orderLines(order);
  const address = addressLines(s);
  const kind = order.subscriptionId ? 'Cobro de suscripción' : 'Nuevo pedido';

  const subject = `${kind} pagado · ${total} · ${s.name ?? customer?.name ?? ''} (${order.reference})`;
  const text = [
    `${kind} pagado: ${order.reference}`,
    `Total: ${total}${order.shippingCents ? ` (envío ${formatCop(order.shippingCents / 100)})` : ''}`,
    '',
    ...items.map((i) => `- ${i.line}: ${i.total}`),
    '',
    `Enviar a: ${s.name ?? ''}`,
    ...address,
    `Tel: ${s.phone ?? customer?.phone ?? ''}`,
    `Correo: ${customer?.email ?? ''}`,
    order.notes ? `Notas: ${order.notes}` : null,
    '',
    `Ver y marcar como enviado: ${adminUrl}`,
  ]
    .filter((l) => l !== null)
    .join('\n');

  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#1d1d1b">
<h2 style="margin:0 0 4px">${escapeHtml(kind)} pagado</h2>
<p style="margin:0 0 16px;color:#666">${escapeHtml(order.reference)} · <strong style="color:#1d1d1b">${escapeHtml(total)}</strong>${
    order.shippingCents ? ` (envío ${escapeHtml(formatCop(order.shippingCents / 100))})` : ''
  }</p>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">${items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${escapeHtml(i.line)}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${escapeHtml(i.total)}</td></tr>`,
    )
    .join('')}</table>
<p style="margin:0 0 4px"><strong>Enviar a</strong></p>
<p style="margin:0 0 16px;line-height:1.5">${[s.name, ...address].map(escapeHtml).join('<br>')}<br>
Tel: ${escapeHtml(s.phone ?? customer?.phone ?? '')}<br>
${escapeHtml(customer?.email ?? '')}</p>
${order.notes ? `<p style="margin:0 0 16px"><strong>Notas:</strong> ${escapeHtml(order.notes)}</p>` : ''}
<p><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#19332f;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Ver pedidos por enviar</a></p>
</div>`;

  return {subject, text, html};
}

/**
 * Asunto, texto y HTML de un correo al cliente, todos con el mismo formato.
 * @param {{
 *   subject: string,
 *   customer: {name?: string}|null,
 *   title: string,
 *   paragraphs: string[],
 *   order?: any,
 *   buttons?: {label: string, url: string}[],
 * }} input
 */
function customerEmail({subject, customer, title, paragraphs, order, buttons = []}) {
  const firstName = String(customer?.name ?? '').trim().split(/\s+/)[0];
  const greeting = firstName ? `Hola ${firstName},` : 'Hola,';
  const help = `¿Dudas? Responde este correo o escríbenos al WhatsApp ${CONTACT.phoneDisplay}.`;
  const items = order ? orderLines(order) : [];
  const shipping = order?.shipping ?? {};
  const total = order ? formatCop(order.amountCents / 100) : '';
  const shippingCost = order?.shippingCents ? formatCop(order.shippingCents / 100) : null;

  const text = [
    greeting,
    '',
    ...paragraphs.flatMap((p) => [p, '']),
    ...(order
      ? [
          `Pedido ${order.reference}`,
          ...items.map((i) => `- ${i.line}: ${i.total}`),
          ...(shippingCost ? [`Envío: ${shippingCost}`] : []),
          `Total: ${total}`,
          '',
          `Enviar a: ${shipping.name ?? ''}`,
          ...addressLines(shipping),
          '',
        ]
      : []),
    ...buttons.flatMap((b) => [`${b.label}: ${b.url}`, '']),
    help,
    'MORIAH Café',
  ].join('\n');

  const orderHtml = order
    ? `<p style="margin:24px 0 8px;color:#666">Pedido ${escapeHtml(order.reference)}</p>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">${items
        .map(
          (i) =>
            `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">${escapeHtml(i.line)}</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${escapeHtml(i.total)}</td></tr>`,
        )
        .join('')}${
        shippingCost
          ? `<tr><td style="padding:6px 0;border-bottom:1px solid #eee">Envío</td><td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right">${escapeHtml(shippingCost)}</td></tr>`
          : ''
      }<tr><td style="padding:6px 0"><strong>Total</strong></td><td style="padding:6px 0;text-align:right"><strong>${escapeHtml(total)}</strong></td></tr></table>
<p style="margin:0 0 4px"><strong>Enviar a</strong></p>
<p style="margin:0 0 16px;line-height:1.5">${[shipping.name, ...addressLines(shipping)].filter(Boolean).map(escapeHtml).join('<br>')}</p>`
    : '';

  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#1d1d1b;line-height:1.5">
<p style="margin:0 0 24px;letter-spacing:.2em;font-weight:600;color:#19332f">MORIAH</p>
<h2 style="margin:0 0 16px">${escapeHtml(title)}</h2>
<p style="margin:0 0 12px">${escapeHtml(greeting)}</p>
${paragraphs.map((p) => `<p style="margin:0 0 12px">${escapeHtml(p)}</p>`).join('\n')}
${orderHtml}
${buttons
  .map(
    (b) =>
      `<p style="margin:16px 0"><a href="${escapeHtml(b.url)}" style="display:inline-block;background:#19332f;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">${escapeHtml(b.label)}</a></p>`,
  )
  .join('\n')}
<p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #eee;color:#666;font-size:14px">${escapeHtml(help)}</p>
</div>`;

  return {subject, text, html};
}

/**
 * @param {any} order
 * @param {{name?: string}|null} customer
 */
export function orderConfirmationEmail(order, customer) {
  return customerEmail({
    subject: `Recibimos tu pago · Pedido ${order.reference}`,
    customer,
    title: order.subscriptionId ? 'Recibimos el pago de tu suscripción' : '¡Gracias por tu compra!',
    paragraphs: [
      'Ya recibimos tu pago y estamos preparando tu café. Te escribiremos de nuevo con la guía de envío cuando salga.',
    ],
    order,
  });
}

/**
 * @param {any} order
 * @param {{name?: string}|null} customer
 */
export function orderShippedEmail(order, customer) {
  return customerEmail({
    subject: `Tu café va en camino · Pedido ${order.reference}`,
    customer,
    title: 'Tu café va en camino',
    paragraphs: [
      'Tu pedido ya salió.',
      order.tracking
        ? `Guía de envío: ${order.tracking}`
        : 'Si necesitas la guía de envío, escríbenos y te la compartimos.',
    ],
    order,
  });
}

/**
 * @param {any} order
 * @param {{name?: string}|null} customer
 * @param {string} shopUrl
 */
export function orderPaymentFailedEmail(order, customer, shopUrl) {
  return customerEmail({
    subject: `Tu pago no fue aprobado · Pedido ${order.reference}`,
    customer,
    title: 'Tu pago no fue aprobado',
    paragraphs: [
      `No pudimos completar el pago del pedido ${order.reference}, así que no lo vamos a despachar.`,
      'Puedes intentarlo de nuevo con otro medio de pago.',
    ],
    buttons: [{label: 'Volver a la tienda', url: shopUrl}],
  });
}

/**
 * @param {{cafeTitle: string, frequencyLabel: string, amountCents: number}} sub
 * @param {{name?: string}|null} customer
 * @param {string} manageUrl
 */
export function subscriptionStartedEmail(sub, customer, manageUrl) {
  return customerEmail({
    subject: 'Tu suscripción al Club de la Memoria',
    customer,
    title: 'Te damos la bienvenida al Club de la Memoria',
    paragraphs: [
      `Tu suscripción a ${sub.cafeTitle} quedó creada. Frecuencia: ${sub.frequencyLabel}. Valor por entrega: ${formatCop(sub.amountCents / 100)}.`,
      'Guarda este correo: desde este enlace puedes pausar, cambiar la frecuencia o cancelar cuando quieras.',
    ],
    buttons: [{label: 'Gestionar mi suscripción', url: manageUrl}],
  });
}

/**
 * @param {{status: string}} sub
 * @param {{name?: string}|null} customer
 * @param {string} manageUrl
 */
export function subscriptionPaymentFailedEmail(sub, customer, manageUrl) {
  return customerEmail({
    subject: 'No pudimos cobrar tu suscripción',
    customer,
    title: 'No pudimos cobrar tu suscripción',
    paragraphs: [
      sub.status === 'past_due'
        ? 'Tu banco rechazó el cobro varias veces, así que detuvimos los cobros y las entregas. Puedes reanudar tu suscripción desde este enlace.'
        : 'Tu banco rechazó el cobro de esta entrega. Lo intentaremos de nuevo en unos días.',
    ],
    buttons: [{label: 'Gestionar mi suscripción', url: manageUrl}],
  });
}

const SUBSCRIPTION_STATUS_COPY = {
  active: 'Tu suscripción está activa.',
  paused: 'Tu suscripción quedó pausada. No haremos cobros hasta que la reanudes.',
  past_due: 'Tu suscripción está detenida por pagos rechazados.',
  cancelled: 'Tu suscripción quedó cancelada. No haremos más cobros.',
};

/**
 * @param {{status: string}} sub
 * @param {{name?: string}|null} customer
 * @param {string} manageUrl
 */
export function subscriptionStatusEmail(sub, customer, manageUrl) {
  return customerEmail({
    subject: 'Actualizamos tu suscripción',
    customer,
    title: 'Actualizamos tu suscripción',
    paragraphs: [SUBSCRIPTION_STATUS_COPY[sub.status] ?? 'Guardamos tus cambios.'],
    buttons: sub.status === 'cancelled' ? [] : [{label: 'Gestionar mi suscripción', url: manageUrl}],
  });
}

/**
 * @param {{name?: string}|null} customer
 * @param {string[]} links
 */
export function subscriptionLinkEmail(customer, links) {
  return customerEmail({
    subject: 'Tu enlace para gestionar la suscripción',
    customer,
    title: 'Gestiona tu suscripción',
    paragraphs: ['Desde este enlace puedes pausar, cambiar la frecuencia o cancelar cuando quieras.'],
    buttons: links.map((url, i) => ({
      label: links.length > 1 ? `Gestionar suscripción ${i + 1}` : 'Gestionar mi suscripción',
      url,
    })),
  });
}

/**
 * @param {{
 *   to: string[],
 *   subject: string,
 *   text: string,
 *   html: string,
 *   replyTo?: string,
 *   idempotencyKey: string,
 * }} email
 */
async function sendEmail({to, subject, text, html, replyTo, idempotencyKey}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
      // Una sola vez aunque el webhook de Wompi llegue repetido (Resend lo respeta 24 h).
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: env('EMAIL_FROM', DEFAULT_FROM),
      to,
      reply_to: replyTo || undefined,
      subject,
      text,
      html,
    }),
  });
  if (!response.ok) {
    throw new Error(`[resend] ${response.status}: ${await response.text().catch(() => '')}`);
  }
  return {sent: true};
}

/** True si el aviso por correo a la tienda está configurado. */
export function orderEmailConfigured() {
  return Boolean(env('RESEND_API_KEY') && env('ORDER_NOTIFY_EMAIL'));
}

/** True si se le puede escribir al cliente (requiere remitente con dominio verificado). */
export function customerEmailConfigured() {
  return Boolean(env('RESEND_API_KEY') && env('EMAIL_FROM'));
}

/**
 * @param {any} order
 * @param {{email: string, name: string, phone?: string|null}|null} customer
 */
export async function notifyMerchantOrderPaid(order, customer) {
  if (!orderEmailConfigured()) return {sent: false, reason: 'not-configured'};
  return sendEmail({
    ...orderPaidEmail(order, customer, `${siteUrl()}/admin/pedidos`),
    to: env('ORDER_NOTIFY_EMAIL')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean),
    replyTo: customer?.email,
    idempotencyKey: `order-paid/${order.reference}`,
  });
}

/**
 * Las respuestas van al correo público de la tienda: @cafemoriah.com no recibe correo.
 * @param {{email?: string}|null} customer
 * @param {{subject: string, text: string, html: string}} email
 * @param {string} idempotencyKey
 */
async function sendToCustomer(customer, email, idempotencyKey) {
  if (!customerEmailConfigured() || !customer?.email) return {sent: false, reason: 'not-configured'};
  return sendEmail({...email, to: [customer.email], replyTo: CONTACT.email, idempotencyKey});
}

/**
 * @param {any} order
 * @param {{email: string, name: string}|null} customer
 */
export function emailOrderConfirmation(order, customer) {
  return sendToCustomer(customer, orderConfirmationEmail(order, customer), `order-confirmation/${order.reference}`);
}

/**
 * Lleva la fecha de despacho en la llave: si la tienda deshace el envío para corregir la
 * guía y lo marca otra vez, el cliente debe recibir el correo corregido.
 * @param {any} order
 * @param {{email: string, name: string}|null} customer
 */
export function emailOrderShipped(order, customer) {
  return sendToCustomer(
    customer,
    orderShippedEmail(order, customer),
    `order-shipped/${order.reference}/${new Date(order.fulfilledAt).getTime()}`,
  );
}

/**
 * @param {any} order
 * @param {{email: string, name: string}|null} customer
 */
export function emailOrderPaymentFailed(order, customer) {
  return sendToCustomer(
    customer,
    orderPaymentFailedEmail(order, customer, `${siteUrl()}/collections/cafes`),
    `order-payment-failed/${order.reference}`,
  );
}

/**
 * @param {{id: string, cafeTitle: string, frequencyLabel: string, amountCents: number}} sub
 * @param {{email: string, name: string}|null} customer
 * @param {string} manageUrl
 */
export function emailSubscriptionStarted(sub, customer, manageUrl) {
  return sendToCustomer(customer, subscriptionStartedEmail(sub, customer, manageUrl), `subscription-started/${sub.id}`);
}

/**
 * @param {{id: string, status: string, failedAttempts: number}} sub
 * @param {{email: string, name: string}|null} customer
 * @param {string} manageUrl
 */
export function emailSubscriptionPaymentFailed(sub, customer, manageUrl) {
  return sendToCustomer(
    customer,
    subscriptionPaymentFailedEmail(sub, customer, manageUrl),
    `subscription-payment-failed/${sub.id}/${sub.failedAttempts}`,
  );
}

/**
 * @param {{id: string, status: string, updatedAt: Date}} sub
 * @param {{email: string, name: string}|null} customer
 * @param {string} manageUrl
 */
export function emailSubscriptionStatus(sub, customer, manageUrl) {
  return sendToCustomer(
    customer,
    subscriptionStatusEmail(sub, customer, manageUrl),
    `subscription-status/${sub.id}/${new Date(sub.updatedAt).getTime()}`,
  );
}

/**
 * Cualquiera puede pedir este correo escribiendo una dirección: la llave lo limita a uno
 * por hora para que el formulario no sirva para llenarle la bandeja a alguien.
 * @param {{id: string, email: string, name: string}} customer
 * @param {string[]} links
 */
export function emailSubscriptionLink(customer, links) {
  const hour = Math.floor(Date.now() / 3_600_000);
  return sendToCustomer(customer, subscriptionLinkEmail(customer, links), `subscription-link/${customer.id}/${hour}`);
}
