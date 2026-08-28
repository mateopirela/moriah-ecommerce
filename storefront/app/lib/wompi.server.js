/**
 * Cliente de Wompi (Bancolombia) — solo servidor.
 *
 *  - Web Checkout (compra única): URL firmada con el secreto de integridad.
 *  - Fuentes de pago (suscripciones): token de tarjeta → payment_source →
 *    transacciones recurrentes con la llave privada.
 *  - Webhooks: verificación del checksum de eventos.
 *
 * Docs: https://docs.wompi.co/docs/colombia/
 */
import {createHash, randomBytes} from 'node:crypto';
import {env} from '~/lib/env.server';

export const WOMPI_CHECKOUT_URL = 'https://checkout.wompi.co/p/';

/** Configuración derivada de las variables de entorno. */
export function wompiConfig() {
  const publicKey = env('WOMPI_PUBLIC_KEY');
  const sandbox = isSandboxKey(publicKey);
  return {
    publicKey,
    privateKey: env('WOMPI_PRIVATE_KEY'),
    integritySecret: env('WOMPI_INTEGRITY_SECRET'),
    eventsSecret: env('WOMPI_EVENTS_SECRET'),
    sandbox,
    baseUrl: apiBaseUrl(publicKey),
    configured: Boolean(
      publicKey && env('WOMPI_PRIVATE_KEY') && env('WOMPI_INTEGRITY_SECRET'),
    ),
  };
}

/** @param {string} publicKey */
export function isSandboxKey(publicKey) {
  return /^pub_test_/.test(publicKey ?? '');
}

/** @param {string} publicKey */
export function apiBaseUrl(publicKey) {
  return isSandboxKey(publicKey)
    ? 'https://sandbox.wompi.co/v1'
    : 'https://production.wompi.co/v1';
}

/**
 * Firma de integridad: SHA256("<ref><amountInCents><currency>[<expiresAt>]<secret>").
 * @param {{reference: string, amountInCents: number, currency?: string, expiresAt?: string}} tx
 * @param {string} secret
 */
export function integritySignature(
  {reference, amountInCents, currency = 'COP', expiresAt},
  secret,
) {
  const parts = [reference, String(amountInCents), currency];
  if (expiresAt) parts.push(expiresAt);
  parts.push(secret);
  return sha256Hex(parts.join(''));
}

/**
 * URL del Web Checkout de Wompi con los datos del comprador precargados.
 * @param {{
 *   reference: string, amountInCents: number, currency?: string,
 *   redirectUrl: string, expiresAt?: string,
 *   customer?: {email?: string, fullName?: string, phone?: string},
 *   shipping?: {addressLine1?: string, addressLine2?: string, city?: string,
 *     region?: string, country?: string, name?: string, phone?: string, postalCode?: string},
 * }} input
 * @param {{publicKey: string, integritySecret: string}} [config]
 */
export function buildCheckoutUrl(input, config = wompiConfig()) {
  const currency = input.currency ?? 'COP';
  const params = new URLSearchParams();
  params.set('public-key', config.publicKey);
  params.set('currency', currency);
  params.set('amount-in-cents', String(input.amountInCents));
  params.set('reference', input.reference);
  params.set(
    'signature:integrity',
    integritySignature(
      {
        reference: input.reference,
        amountInCents: input.amountInCents,
        currency,
        expiresAt: input.expiresAt,
      },
      config.integritySecret,
    ),
  );
  params.set('redirect-url', input.redirectUrl);
  if (input.expiresAt) params.set('expiration-time', input.expiresAt);

  const c = input.customer ?? {};
  if (c.email) params.set('customer-data:email', c.email);
  if (c.fullName) params.set('customer-data:full-name', c.fullName);
  if (c.phone) params.set('customer-data:phone-number', c.phone);

  const s = input.shipping ?? {};
  if (s.addressLine1) params.set('shipping-address:address-line-1', s.addressLine1);
  if (s.addressLine2) params.set('shipping-address:address-line-2', s.addressLine2);
  if (s.city) params.set('shipping-address:city', s.city);
  if (s.region) params.set('shipping-address:region', s.region);
  params.set('shipping-address:country', s.country ?? 'CO');
  if (s.name) params.set('shipping-address:name', s.name);
  if (s.phone) params.set('shipping-address:phone-number', s.phone);
  if (s.postalCode) params.set('shipping-address:postal-code', s.postalCode);

  return `${WOMPI_CHECKOUT_URL}?${params.toString()}`;
}

/**
 * Checksum de un evento: SHA256(valores de signature.properties en orden +
 * timestamp + secreto de eventos), en hexadecimal mayúsculas.
 * @param {any} event
 * @param {string} secret
 */
export function eventChecksum(event, secret) {
  const props = event?.signature?.properties ?? [];
  const values = props.map((path) => stringify(getPath(event?.data, path)));
  return sha256Hex(values.join('') + String(event?.timestamp ?? '') + secret).toUpperCase();
}

/**
 * @param {any} event
 * @param {string} [secret]
 */
export function verifyEvent(event, secret = wompiConfig().eventsSecret) {
  if (!secret || !event?.signature?.checksum) return false;
  const expected = eventChecksum(event, secret);
  return expected === String(event.signature.checksum).toUpperCase();
}

/** Referencia única legible: MOR-<base36 time>-<hex>. */
export function newReference(prefix = 'MOR') {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;
}

/**
 * Estado Wompi → estado interno del pedido.
 * @param {string} status
 */
export function mapStatus(status) {
  switch ((status ?? '').toUpperCase()) {
    case 'APPROVED':
      return 'approved';
    case 'DECLINED':
      return 'declined';
    case 'VOIDED':
      return 'voided';
    case 'ERROR':
      return 'error';
    default:
      return 'pending';
  }
}

/** Ciclo de vida terminado (no cambiará más). */
export function isFinalStatus(status) {
  return ['approved', 'declined', 'voided', 'error'].includes(status);
}

/**
 * Llamada genérica a la API REST.
 * @param {string} path
 * @param {{method?: string, body?: any, auth?: 'public'|'private'|'none'}} [options]
 */
async function api(path, {method = 'GET', body, auth = 'private'} = {}) {
  const config = wompiConfig();
  const headers = {'Content-Type': 'application/json'};
  if (auth === 'private') headers.Authorization = `Bearer ${config.privateKey}`;
  if (auth === 'public') headers.Authorization = `Bearer ${config.publicKey}`;

  const response = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason =
      json?.error?.reason ||
      json?.error?.messages ||
      json?.error?.type ||
      `HTTP ${response.status}`;
    const error = new Error(
      `[wompi] ${method} ${path} → ${response.status}: ${
        typeof reason === 'string' ? reason : JSON.stringify(reason)
      }`,
    );
    error.status = response.status;
    error.body = json;
    throw error;
  }
  return json.data ?? json;
}

/** @param {string} id */
export function getTransaction(id) {
  return api(`/transactions/${encodeURIComponent(id)}`, {auth: 'none'});
}

/** Tokens de aceptación (política de privacidad + tratamiento de datos). */
export async function getAcceptanceTokens() {
  const merchant = await api(`/merchants/${wompiConfig().publicKey}`, {auth: 'none'});
  return {
    acceptance: merchant.presigned_acceptance,
    personalData: merchant.presigned_personal_data_auth,
  };
}

/**
 * Crea una fuente de pago a partir de un token de tarjeta.
 * @param {{token: string, customerEmail: string, acceptanceToken: string, personalAuthToken: string}} input
 */
export function createPaymentSource(input) {
  return api('/payment_sources', {
    method: 'POST',
    body: {
      type: 'CARD',
      token: input.token,
      customer_email: input.customerEmail,
      acceptance_token: input.acceptanceToken,
      accept_personal_auth: input.personalAuthToken,
    },
  });
}

/**
 * Cobra contra una fuente de pago guardada (cobro recurrente).
 * @param {{
 *   amountInCents: number, currency?: string, reference: string, customerEmail: string,
 *   paymentSourceId: number, installments?: number,
 *   customerData?: {fullName?: string, phoneNumber?: string},
 *   shippingAddress?: {addressLine1: string, city: string, region: string, country?: string,
 *     phoneNumber?: string, name?: string, addressLine2?: string},
 * }} input
 */
export function chargePaymentSource(input) {
  const config = wompiConfig();
  const currency = input.currency ?? 'COP';
  const body = {
    amount_in_cents: input.amountInCents,
    currency,
    signature: integritySignature(
      {reference: input.reference, amountInCents: input.amountInCents, currency},
      config.integritySecret,
    ),
    customer_email: input.customerEmail,
    payment_method: {installments: input.installments ?? 1},
    reference: input.reference,
    payment_source_id: input.paymentSourceId,
    recurrent: true,
  };
  if (input.customerData) {
    body.customer_data = {
      full_name: input.customerData.fullName,
      phone_number: input.customerData.phoneNumber,
    };
  }
  if (input.shippingAddress) {
    const s = input.shippingAddress;
    body.shipping_address = {
      address_line_1: s.addressLine1,
      address_line_2: s.addressLine2 || undefined,
      country: s.country ?? 'CO',
      region: s.region,
      city: s.city,
      name: s.name,
      phone_number: s.phoneNumber,
    };
  }
  return api('/transactions', {method: 'POST', body});
}

/**
 * Espera a que una transacción salga de PENDING (máx. ~8 s).
 * @param {string} id
 */
export async function waitForTransaction(id, {attempts = 5, delayMs = 1500} = {}) {
  let tx = await getTransaction(id);
  for (let i = 0; i < attempts && mapStatus(tx.status) === 'pending'; i++) {
    await new Promise((r) => setTimeout(r, delayMs));
    tx = await getTransaction(id);
  }
  return tx;
}

function sha256Hex(input) {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

function getPath(obj, path) {
  return String(path)
    .split('.')
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function stringify(value) {
  if (value == null) return '';
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}
