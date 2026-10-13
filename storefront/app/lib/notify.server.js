/**
 * Aviso interno a la tienda cuando entra un pedido pagado (email vía Resend).
 *
 * Variables: RESEND_API_KEY y ORDER_NOTIFY_EMAIL (uno o varios correos separados
 * por coma). EMAIL_FROM es opcional: sin dominio verificado en Resend se usa su
 * remitente de pruebas, que solo entrega al correo dueño de la cuenta de Resend.
 * Sin llave o sin destinatario no hace nada.
 */
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

/**
 * Asunto y cuerpo del aviso. Puro, para poder probarlo.
 * @param {any} order
 * @param {{email: string, name: string, phone?: string|null}|null} customer
 * @param {string} adminUrl
 */
export function orderPaidEmail(order, customer, adminUrl) {
  const s = order.shipping ?? {};
  const total = formatCop(order.amountCents / 100);
  const items = (order.items ?? []).map((i) => {
    const options = (i.options ?? []).map((o) => o.value).join(' · ');
    return {line: `${i.quantity} × ${i.title}${options ? ` (${options})` : ''}`, total: formatCop(i.totalPrice)};
  });
  const address = [s.address, s.address2, `${s.city ?? ''}, ${s.region ?? ''}`].filter(Boolean);
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

/** True si el aviso por correo está configurado. */
export function orderEmailConfigured() {
  return Boolean(env('RESEND_API_KEY') && env('ORDER_NOTIFY_EMAIL'));
}

/**
 * @param {any} order
 * @param {{email: string, name: string, phone?: string|null}|null} customer
 */
export async function notifyMerchantOrderPaid(order, customer) {
  if (!orderEmailConfigured()) return {sent: false, reason: 'not-configured'};
  const {subject, text, html} = orderPaidEmail(order, customer, `${siteUrl()}/admin/pedidos`);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env('EMAIL_FROM', DEFAULT_FROM),
      to: env('ORDER_NOTIFY_EMAIL')
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean),
      reply_to: customer?.email || undefined,
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
