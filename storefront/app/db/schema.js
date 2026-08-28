import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/** Compradores (una fila por email). */
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  createdAt: timestamp('created_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
});

/**
 * Pedidos. Cubre compras únicas (web checkout de Wompi) y cada cobro de una
 * suscripción (`subscriptionId` no nulo). `status` sigue los estados de Wompi:
 * pending | approved | declined | voided | error
 */
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  reference: text('reference').notNull().unique(),
  customerId: uuid('customer_id').references(() => customers.id),
  subscriptionId: uuid('subscription_id'),
  status: text('status').notNull().default('pending'),
  amountCents: integer('amount_cents').notNull(),
  shippingCents: integer('shipping_cents').notNull().default(0),
  currency: text('currency').notNull().default('COP'),
  items: jsonb('items').notNull(),
  shipping: jsonb('shipping').notNull(),
  notes: text('notes'),
  wompiTransactionId: text('wompi_transaction_id'),
  wompiPaymentMethod: text('wompi_payment_method'),
  createdAt: timestamp('created_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
});

/** Fuentes de pago tokenizadas en Wompi (tarjeta guardada para cobros recurrentes). */
export const paymentSources = pgTable('payment_sources', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id),
  wompiPaymentSourceId: integer('wompi_payment_source_id').notNull(),
  type: text('type').notNull(),
  brand: text('brand'),
  lastFour: text('last_four'),
  expMonth: text('exp_month'),
  expYear: text('exp_year'),
  status: text('status').notNull().default('AVAILABLE'),
  createdAt: timestamp('created_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
});

/**
 * Suscripciones del Club Moriah.
 * status: active | paused | past_due | cancelled
 */
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id),
  paymentSourceId: uuid('payment_source_id')
    .notNull()
    .references(() => paymentSources.id),
  manageToken: text('manage_token').notNull().unique(),
  status: text('status').notNull().default('active'),
  cafeHandle: text('cafe_handle').notNull(),
  sizeLabel: text('size_label').notNull(),
  grind: text('grind').notNull(),
  quantity: integer('quantity').notNull().default(1),
  frequencyDays: integer('frequency_days').notNull(),
  unitPriceCents: integer('unit_price_cents').notNull(),
  amountCents: integer('amount_cents').notNull(),
  shipping: jsonb('shipping').notNull(),
  nextChargeAt: timestamp('next_charge_at', {withTimezone: true}).notNull(),
  lastChargedAt: timestamp('last_charged_at', {withTimezone: true}),
  failedAttempts: integer('failed_attempts').notNull().default(0),
  cancelledAt: timestamp('cancelled_at', {withTimezone: true}),
  createdAt: timestamp('created_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
});

/** Eventos de Wompi ya procesados (idempotencia del webhook). */
export const wompiEvents = pgTable('wompi_events', {
  id: text('id').primaryKey(),
  event: text('event').notNull(),
  transactionId: text('transaction_id'),
  verified: boolean('verified').notNull(),
  payload: jsonb('payload').notNull(),
  receivedAt: timestamp('received_at', {withTimezone: true})
    .notNull()
    .defaultNow(),
});
