import 'dotenv/config';

/**
 * Server-only access to environment variables. Loads `.env` in development
 * (no-op on Vercel, where variables come from the project settings).
 * @param {string} name
 * @param {string} [fallback]
 */
export function env(name, fallback = '') {
  const value = process.env[name];
  return value == null || value === '' ? fallback : value;
}

/** True when running on Vercel (production or preview). */
export const isVercel = Boolean(process.env.VERCEL);

export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Public origin used for redirects, sitemap and emails.
 * @param {Request} [request]
 */
export function siteUrl(request) {
  const configured = env('PUBLIC_SITE_URL');
  if (configured) return configured.replace(/\/$/, '');
  if (request) return new URL(request.url).origin;
  return 'http://localhost:3000';
}

/**
 * True when orders can be persisted: a Postgres URL in production, or the
 * embedded PGlite database in local development.
 */
export function databaseConfigured() {
  return Boolean(env('DATABASE_URL')) || !isVercel;
}

/** Session secret; fails loudly so a misconfigured deploy is obvious. */
export function sessionSecret() {
  const secret = env('SESSION_SECRET');
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }
  return secret;
}
