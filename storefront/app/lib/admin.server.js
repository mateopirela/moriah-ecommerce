/**
 * Acceso al panel interno (/admin). Una sola contraseña en ADMIN_PASSWORD;
 * la sesión vive en una cookie firmada aparte de la del carrito.
 */
import {createHash, timingSafeEqual} from 'node:crypto';
import {createCookieSessionStorage, redirect} from 'react-router';
import {env, isProduction, sessionSecret} from '~/lib/env.server';

const TWELVE_HOURS = 60 * 60 * 12;

let storage;

function getStorage() {
  if (!storage) {
    storage = createCookieSessionStorage({
      cookie: {
        name: 'moriah_admin',
        httpOnly: true,
        path: '/admin',
        sameSite: 'strict',
        secure: isProduction,
        secrets: [sessionSecret()],
        maxAge: TWELVE_HOURS,
      },
    });
  }
  return storage;
}

export function adminConfigured() {
  return Boolean(env('ADMIN_PASSWORD'));
}

/**
 * Compara en tiempo constante (sobre hashes, para no filtrar la longitud).
 * @param {string} candidate
 */
export function checkAdminPassword(candidate) {
  const expected = env('ADMIN_PASSWORD');
  if (!expected || !candidate) return false;
  const a = createHash('sha256').update(String(candidate)).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

/** @param {Request} request */
async function getSession(request) {
  return getStorage()
    .getSession(request.headers.get('Cookie'))
    .catch(() => getStorage().getSession());
}

/** @param {Request} request */
export async function isAdmin(request) {
  if (!adminConfigured()) return false;
  return (await getSession(request)).get('admin') === true;
}

/**
 * Corta la petición con una redirección al login si no hay sesión.
 * @param {Request} request
 */
export async function requireAdmin(request) {
  if (!(await isAdmin(request))) throw redirect('/admin/login');
}

/** @param {Request} request */
export async function loginHeaders(request) {
  const session = await getSession(request);
  session.set('admin', true);
  return {'Set-Cookie': await getStorage().commitSession(session)};
}

/** @param {Request} request */
export async function logoutHeaders(request) {
  return {'Set-Cookie': await getStorage().destroySession(await getSession(request))};
}
