import {eq} from 'drizzle-orm';
import {customers, orders} from '~/db/schema';
import {getProduct, toCents} from '~/lib/catalog';
import {notifyOrderPaid} from '~/lib/klaviyo.server';
import {
  getTransaction,
  isFinalStatus,
  mapStatus,
  newReference,
} from '~/lib/wompi.server';

/**
 * Crea o actualiza un cliente por email.
 * @param {any} db
 * @param {{email: string, name: string, phone?: string}} input
 */
export async function upsertCustomer(db, {email, name, phone}) {
  const normalizedEmail = email.trim().toLowerCase();
  const [row] = await db
    .insert(customers)
    .values({email: normalizedEmail, name: name.trim(), phone: phone?.trim() || null})
    .onConflictDoUpdate({
      target: customers.email,
      set: {name: name.trim(), phone: phone?.trim() || null},
    })
    .returning();
  return row;
}

/** @param {any} db @param {string} id */
export async function findCustomer(db, id) {
  if (!id) return null;
  const [row] = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return row ?? null;
}

/**
 * Snapshot de las líneas del carrito para guardarlas en el pedido.
 * @param {{lines: any[]}} cart
 */
export function orderItemsFromCart(cart) {
  return cart.lines.map((l) => ({
    handle: l.handle,
    title: l.title,
    image: l.image,
    options: l.options,
    quantity: l.quantity,
    unitPrice: l.unitPrice,
    totalPrice: l.totalPrice,
  }));
}

/**
 * @param {any} db
 * @param {{
 *   customerId: string, items: any[], amountCents: number, shippingCents?: number,
 *   shipping: object, notes?: string|null, subscriptionId?: string|null, prefix?: string,
 * }} input
 */
export async function createOrder(db, input) {
  const [row] = await db
    .insert(orders)
    .values({
      reference: newReference(input.prefix ?? 'MOR'),
      customerId: input.customerId,
      subscriptionId: input.subscriptionId ?? null,
      status: 'pending',
      amountCents: input.amountCents,
      shippingCents: input.shippingCents ?? 0,
      currency: 'COP',
      items: input.items,
      shipping: input.shipping,
      notes: input.notes ?? null,
    })
    .returning();
  return row;
}

/** @param {any} db @param {string} reference */
export async function findOrderByReference(db, reference) {
  if (!reference) return null;
  const [row] = await db
    .select()
    .from(orders)
    .where(eq(orders.reference, reference))
    .limit(1);
  return row ?? null;
}

/** @param {any} db @param {string} transactionId */
export async function findOrderByTransactionId(db, transactionId) {
  if (!transactionId) return null;
  const [row] = await db
    .select()
    .from(orders)
    .where(eq(orders.wompiTransactionId, transactionId))
    .limit(1);
  return row ?? null;
}

/**
 * Comprueba que una transacción de Wompi corresponde a este pedido
 * (misma referencia y mismo monto). Evita marcar pagos con datos manipulados.
 * @param {any} order
 * @param {any} tx
 */
export function transactionMatchesOrder(order, tx) {
  return (
    Boolean(tx) &&
    tx.reference === order.reference &&
    Number(tx.amount_in_cents) === Number(order.amountCents) &&
    (tx.currency ?? 'COP') === order.currency
  );
}

/**
 * Aplica el estado de una transacción al pedido. Idempotente: si el pedido ya
 * está en un estado final igual, no hace nada. Notifica al cliente cuando el
 * pedido pasa a aprobado.
 * @param {any} db
 * @param {any} order
 * @param {any} tx
 * @returns {Promise<{order: any, changed: boolean, previousStatus: string}>}
 */
export async function applyTransactionToOrder(db, order, tx) {
  const status = mapStatus(tx.status);
  const previousStatus = order.status;
  if (isFinalStatus(previousStatus) && previousStatus === status) {
    return {order, changed: false, previousStatus};
  }
  const [updated] = await db
    .update(orders)
    .set({
      status,
      wompiTransactionId: String(tx.id),
      wompiPaymentMethod: tx.payment_method_type ?? tx.payment_method?.type ?? null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id))
    .returning();

  if (status === 'approved' && previousStatus !== 'approved') {
    const customer = await findCustomer(db, updated.customerId);
    if (customer) {
      await notifyOrderPaid(updated, customer).catch((err) =>
        console.error('notifyOrderPaid failed', err),
      );
    }
  }
  return {order: updated, changed: previousStatus !== status, previousStatus};
}

/**
 * Consulta la transacción en Wompi y sincroniza el pedido (redirect-url y
 * respaldo del webhook).
 * @param {any} db
 * @param {{reference?: string, transactionId?: string}} input
 */
export async function syncOrderWithTransaction(db, {reference, transactionId}) {
  const order =
    (await findOrderByReference(db, reference)) ??
    (await findOrderByTransactionId(db, transactionId));
  if (!order) return {order: null, tx: null, matches: false};

  const id = transactionId ?? order.wompiTransactionId;
  if (!id) return {order, tx: null, matches: false};

  const tx = await getTransaction(id);
  if (!transactionMatchesOrder(order, tx)) {
    console.warn('[wompi] transaction does not match order', {
      reference: order.reference,
      tx: tx?.id,
    });
    return {order, tx, matches: false};
  }
  const result = await applyTransactionToOrder(db, order, tx);
  return {...result, tx, matches: true};
}

/** Título legible de un pedido para emails y páginas de gracias. */
export function describeItems(items) {
  return (items ?? [])
    .map((i) => `${i.quantity}× ${i.title}${optionSuffix(i.options)}`)
    .join(', ');
}

function optionSuffix(options) {
  if (!options?.length) return '';
  return ` (${options.map((o) => o.value).join(', ')})`;
}

/** Recalcula el monto de un carrito en centavos (defensa contra manipulación). */
export function cartAmountCents(cart) {
  const subtotal = cart.lines.reduce(
    (acc, l) => acc + (getProduct(l.handle) ? l.totalPrice : 0),
    0,
  );
  return toCents(subtotal + cart.shipping);
}
