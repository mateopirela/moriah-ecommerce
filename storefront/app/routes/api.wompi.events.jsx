import {wompiEvents} from '~/db/schema';
import {getDb} from '~/db/client.server';
import {
  applyTransactionToOrder,
  findOrderByReference,
  transactionMatchesOrder,
} from '~/lib/orders.server';
import {findSubscription, reconcileSubscriptionCharge} from '~/lib/subscriptions.server';
import {verifyEvent} from '~/lib/wompi.server';

/**
 * Webhook de Wompi (Panel → Desarrolladores → URL de eventos):
 *   POST https://<tu-dominio>/api/wompi/events
 * Verifica el checksum, guarda el evento (idempotencia) y sincroniza el pedido
 * y, si aplica, la suscripción. Siempre responde 200 a eventos válidos.
 * @param {import('react-router').ActionFunctionArgs} args
 */
export async function action({request}) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {status: 405});
  }
  const event = await request.json().catch(() => null);
  if (!event || typeof event !== 'object') {
    return Response.json({error: 'invalid json'}, {status: 400});
  }

  const verified = verifyEvent(event);
  const tx = event.data?.transaction;
  const db = await getDb();

  const id = [event.event, tx?.id ?? 'none', tx?.status ?? '', event.timestamp ?? ''].join(':');
  try {
    await db.insert(wompiEvents).values({
      id,
      event: String(event.event ?? 'unknown'),
      transactionId: tx?.id ? String(tx.id) : null,
      verified,
      payload: event,
    });
  } catch {
    return Response.json({ok: true, duplicate: true});
  }

  if (!verified) {
    console.warn('[wompi] event with invalid checksum', id);
    return Response.json({error: 'invalid signature'}, {status: 401});
  }
  if (event.event !== 'transaction.updated' || !tx) {
    return Response.json({ok: true, ignored: event.event});
  }

  const order = await findOrderByReference(db, tx.reference);
  if (!order) return Response.json({ok: true, unknownReference: tx.reference});
  if (!transactionMatchesOrder(order, tx)) {
    console.warn('[wompi] event does not match order', {reference: tx.reference, tx: tx.id});
    return Response.json({ok: true, mismatch: true});
  }

  const {order: updated} = await applyTransactionToOrder(db, order, tx);
  if (updated.subscriptionId) {
    const sub = await findSubscription(db, updated.subscriptionId);
    if (sub) await reconcileSubscriptionCharge(db, sub, updated);
  }
  return Response.json({ok: true, reference: updated.reference, status: updated.status});
}

export function loader() {
  return new Response('Method Not Allowed', {status: 405});
}
