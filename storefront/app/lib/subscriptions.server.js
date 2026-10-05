/**
 * Club Moriah — suscripciones con cobro recurrente vía fuentes de pago de Wompi.
 *
 * Ciclo:
 *   1. /suscripcion: el navegador tokeniza la tarjeta → el servidor crea la
 *      fuente de pago y la suscripción y ejecuta el primer cobro.
 *   2. /api/cron/subscriptions (diario): cobra las suscripciones vencidas.
 *   3. /api/wompi/events: resuelve cobros que quedaron PENDING.
 *   4. /suscripcion/gestionar?token=…: pausar, reanudar, cambiar frecuencia, cancelar.
 */
import {randomBytes} from 'node:crypto';
import {and, eq, inArray, lte} from 'drizzle-orm';
import {orders, paymentSources, subscriptions} from '~/db/schema';
import {FREQUENCY_DAYS, getProduct, lineOptions, subscriptionAmounts} from '~/lib/catalog';
import {
  notifySubscriptionPaymentFailed,
  notifySubscriptionStarted,
  notifySubscriptionStatus,
} from '~/lib/klaviyo.server';
import {
  applyTransactionToOrder,
  createOrder,
  findCustomer,
} from '~/lib/orders.server';
import {
  chargePaymentSource,
  mapStatus,
  waitForTransaction,
} from '~/lib/wompi.server';

export const MAX_FAILED_ATTEMPTS = 3;
export const RETRY_DAYS = 2;
/** Ventana de idempotencia: no crear otro cobro si hay uno pendiente reciente. */
const PENDING_WINDOW_MS = 12 * 60 * 60 * 1000;

/** @param {Date} date @param {number} days */
export function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/** @param {number} days */
export function frequencyLabel(days) {
  return (
    Object.entries(FREQUENCY_DAYS).find(([, d]) => d === days)?.[0] ??
    `Cada ${days} días`
  );
}

export {subscriptionAmounts};

/**
 * Crea la fuente de pago + la suscripción (sin cobrar todavía).
 * @param {any} db
 * @param {{
 *   customer: {id: string}, paymentSource: {wompiPaymentSourceId: number, brand?: string,
 *     lastFour?: string, expMonth?: string, expYear?: string, status?: string},
 *   cafeHandle: string, sizeLabel: string, grind: string, quantity: number,
 *   frequencyDays: number, shipping: object, now?: Date,
 * }} input
 */
export async function createSubscription(db, input) {
  const now = input.now ?? new Date();
  const [source] = await db
    .insert(paymentSources)
    .values({
      customerId: input.customer.id,
      wompiPaymentSourceId: input.paymentSource.wompiPaymentSourceId,
      type: 'CARD',
      brand: input.paymentSource.brand ?? null,
      lastFour: input.paymentSource.lastFour ?? null,
      expMonth: input.paymentSource.expMonth ?? null,
      expYear: input.paymentSource.expYear ?? null,
      status: input.paymentSource.status ?? 'AVAILABLE',
    })
    .returning();

  const amounts = subscriptionAmounts({...input, city: input.shipping?.city});
  const [sub] = await db
    .insert(subscriptions)
    .values({
      customerId: input.customer.id,
      paymentSourceId: source.id,
      manageToken: randomBytes(24).toString('hex'),
      status: 'active',
      cafeHandle: input.cafeHandle,
      sizeLabel: input.sizeLabel,
      grind: input.grind,
      quantity: input.quantity,
      frequencyDays: input.frequencyDays,
      unitPriceCents: amounts.unitPriceCents,
      amountCents: amounts.amountCents,
      shipping: input.shipping,
      nextChargeAt: now,
    })
    .returning();
  return {subscription: sub, paymentSource: source};
}

/** Línea de pedido que representa una entrega de la suscripción. */
export function subscriptionOrderItems(sub) {
  const product = getProduct(sub.cafeHandle);
  return [
    {
      handle: sub.cafeHandle,
      title: `${product?.title ?? sub.cafeHandle} · Club Moriah`,
      image: product?.image,
      options: lineOptions(sub.cafeHandle, {size: sub.sizeLabel, grind: sub.grind}),
      quantity: sub.quantity,
      unitPrice: sub.unitPriceCents / 100,
      totalPrice: (sub.unitPriceCents * sub.quantity) / 100,
      subscription: true,
    },
  ];
}

/**
 * Ejecuta un cobro de la suscripción. Crea el pedido, cobra la fuente de pago
 * y actualiza la suscripción según el resultado.
 * @param {any} db
 * @param {any} sub
 * @param {{now?: Date, wait?: boolean}} [options]
 */
export async function chargeSubscription(db, sub, {now = new Date(), wait = false} = {}) {
  if (!['active', 'past_due'].includes(sub.status)) {
    return {skipped: 'status', subscription: sub};
  }

  const recentPending = await findRecentPendingOrder(db, sub.id, now);
  if (recentPending) {
    return {skipped: 'pending', subscription: sub, order: recentPending};
  }

  const [customer, source] = await Promise.all([
    findCustomer(db, sub.customerId),
    findPaymentSource(db, sub.paymentSourceId),
  ]);
  if (!customer || !source) {
    throw new Error(`Subscription ${sub.id} is missing customer or payment source`);
  }

  const amounts = subscriptionAmounts({...sub, city: sub.shipping?.city});
  const order = await createOrder(db, {
    customerId: customer.id,
    subscriptionId: sub.id,
    items: subscriptionOrderItems(sub),
    amountCents: amounts.amountCents,
    shippingCents: amounts.shippingCents,
    shipping: sub.shipping,
    prefix: 'SUB',
  });

  let tx;
  try {
    tx = await chargePaymentSource({
      amountInCents: order.amountCents,
      reference: order.reference,
      customerEmail: customer.email,
      paymentSourceId: source.wompiPaymentSourceId,
      customerData: {fullName: customer.name, phoneNumber: customer.phone ?? undefined},
      shippingAddress: toWompiShipping(sub.shipping, customer),
    });
    if (wait && mapStatus(tx.status) === 'pending') {
      tx = await waitForTransaction(tx.id);
    }
  } catch (error) {
    console.error(`[subscriptions] charge failed for ${sub.id}`, error);
    const [failedOrder] = await db
      .update(orders)
      .set({status: 'error', notes: String(error.message).slice(0, 500), updatedAt: now})
      .where(eq(orders.id, order.id))
      .returning();
    const subscription = await registerFailure(db, sub, customer, now);
    return {order: failedOrder, tx: null, subscription, error};
  }

  const {order: updatedOrder} = await applyTransactionToOrder(db, order, tx);
  const subscription = await reconcileSubscriptionCharge(db, sub, updatedOrder, {
    now,
    customer,
  });
  return {order: updatedOrder, tx, subscription};
}

/**
 * Actualiza la suscripción a partir del estado de un pedido/cobro.
 * Se usa tanto tras cobrar como cuando el webhook resuelve un cobro pendiente.
 * @param {any} db
 * @param {any} sub
 * @param {any} order
 * @param {{now?: Date, customer?: any}} [options]
 */
export async function reconcileSubscriptionCharge(db, sub, order, {now = new Date(), customer} = {}) {
  if (order.status === 'approved') {
    if (sub.lastChargedAt && order.updatedAt && sub.lastChargedAt >= order.createdAt) {
      return sub; // ya contabilizado
    }
    const [updated] = await db
      .update(subscriptions)
      .set({
        status: 'active',
        failedAttempts: 0,
        lastChargedAt: now,
        nextChargeAt: addDays(now, sub.frequencyDays),
        updatedAt: now,
      })
      .where(eq(subscriptions.id, sub.id))
      .returning();
    return updated;
  }
  if (['declined', 'error', 'voided'].includes(order.status)) {
    const c = customer ?? (await findCustomer(db, sub.customerId));
    return registerFailure(db, sub, c, now);
  }
  return sub; // pending: el webhook lo resolverá
}

async function registerFailure(db, sub, customer, now) {
  const failedAttempts = (sub.failedAttempts ?? 0) + 1;
  const pastDue = failedAttempts >= MAX_FAILED_ATTEMPTS;
  const [updated] = await db
    .update(subscriptions)
    .set({
      failedAttempts,
      status: pastDue ? 'past_due' : sub.status,
      nextChargeAt: pastDue ? sub.nextChargeAt : addDays(now, RETRY_DAYS),
      updatedAt: now,
    })
    .where(eq(subscriptions.id, sub.id))
    .returning();
  if (customer) {
    await notifySubscriptionPaymentFailed(updated, customer, '').catch(() => {});
  }
  return updated;
}

/**
 * Cobra todas las suscripciones vencidas. Pensado para el cron diario.
 * @param {any} db
 * @param {Date} [now]
 */
export async function chargeDueSubscriptions(db, now = new Date()) {
  const due = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        inArray(subscriptions.status, ['active']),
        lte(subscriptions.nextChargeAt, now),
      ),
    );
  const results = [];
  for (const sub of due) {
    try {
      const result = await chargeSubscription(db, sub, {now});
      results.push({
        id: sub.id,
        status: result.skipped ? `skipped:${result.skipped}` : result.order?.status,
      });
    } catch (error) {
      console.error(`[subscriptions] unexpected error for ${sub.id}`, error);
      results.push({id: sub.id, status: 'exception', error: error.message});
    }
  }
  return {checked: due.length, results};
}

/** @param {any} db @param {string} token */
export async function findByManageToken(db, token) {
  if (!token) return null;
  const [row] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.manageToken, token))
    .limit(1);
  return row ?? null;
}

/** @param {any} db @param {string} id */
export async function findSubscription(db, id) {
  if (!id) return null;
  const [row] = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
  return row ?? null;
}

/** @param {any} db @param {string} id */
export async function findPaymentSource(db, id) {
  const [row] = await db
    .select()
    .from(paymentSources)
    .where(eq(paymentSources.id, id))
    .limit(1);
  return row ?? null;
}

/**
 * Acciones del cliente sobre su suscripción.
 * @param {any} db
 * @param {any} sub
 * @param {'pause'|'resume'|'cancel'|'frequency'} action
 * @param {{frequencyDays?: number, now?: Date}} [options]
 */
export async function manageSubscription(db, sub, action, {frequencyDays, now = new Date()} = {}) {
  let patch;
  switch (action) {
    case 'pause':
      if (sub.status === 'cancelled') return sub;
      patch = {status: 'paused'};
      break;
    case 'resume': {
      if (sub.status === 'cancelled') return sub;
      const next = sub.nextChargeAt < now ? addDays(now, 1) : sub.nextChargeAt;
      patch = {status: 'active', failedAttempts: 0, nextChargeAt: next};
      break;
    }
    case 'cancel':
      patch = {status: 'cancelled', cancelledAt: now};
      break;
    case 'frequency': {
      if (!Object.values(FREQUENCY_DAYS).includes(frequencyDays)) return sub;
      const base = sub.lastChargedAt ?? now;
      patch = {
        frequencyDays,
        nextChargeAt: sub.status === 'active' ? addDays(base, frequencyDays) : sub.nextChargeAt,
      };
      break;
    }
    default:
      return sub;
  }
  const [updated] = await db
    .update(subscriptions)
    .set({...patch, updatedAt: now})
    .where(eq(subscriptions.id, sub.id))
    .returning();
  const customer = await findCustomer(db, sub.customerId);
  if (customer) await notifySubscriptionStatus(updated, customer).catch(() => {});
  return updated;
}

/**
 * Notifica el alta de la suscripción (email con enlace de gestión).
 * @param {any} sub
 * @param {{email: string, name: string}} customer
 * @param {string} manageUrl
 */
export function announceSubscription(sub, customer, manageUrl) {
  const product = getProduct(sub.cafeHandle);
  return notifySubscriptionStarted(
    {
      id: sub.id,
      cafeTitle: product?.title ?? sub.cafeHandle,
      frequencyLabel: frequencyLabel(sub.frequencyDays),
      amountCents: sub.amountCents,
    },
    customer,
    manageUrl,
  ).catch(() => {});
}

async function findRecentPendingOrder(db, subscriptionId, now) {
  const rows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.subscriptionId, subscriptionId), eq(orders.status, 'pending')));
  return (
    rows.find((o) => now.getTime() - new Date(o.createdAt).getTime() < PENDING_WINDOW_MS) ??
    null
  );
}

function toWompiShipping(shipping, customer) {
  if (!shipping?.address) return undefined;
  return {
    addressLine1: shipping.address,
    addressLine2: shipping.address2 || undefined,
    city: shipping.city,
    region: shipping.region,
    country: 'CO',
    name: shipping.name ?? customer.name,
    phoneNumber: shipping.phone ?? customer.phone ?? undefined,
  };
}
