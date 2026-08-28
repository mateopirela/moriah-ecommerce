import {createCookieSessionStorage} from 'react-router';
import {isProduction, sessionSecret} from '~/lib/env.server';
import {buildCart, sanitizeLines, toStorage} from '~/lib/cart';
import {getDiscount} from '~/data/discounts';

const COOKIE_NAME = 'moriah_cart';
const THIRTY_DAYS = 60 * 60 * 24 * 30;

let storage;

function getStorage() {
  if (!storage) {
    storage = createCookieSessionStorage({
      cookie: {
        name: COOKIE_NAME,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: isProduction,
        secrets: [sessionSecret()],
        maxAge: THIRTY_DAYS,
      },
    });
  }
  return storage;
}

/**
 * Lee el carrito (líneas + código de descuento) desde la cookie firmada.
 * @param {Request} request
 * @returns {Promise<{session: import('react-router').Session, lines: Array, discountCode: string|null}>}
 */
export async function readCartSession(request) {
  const session = await getStorage()
    .getSession(request.headers.get('Cookie'))
    .catch(() => getStorage().getSession());
  const discountCode = getDiscount(session.get('discountCode'))?.code ?? null;
  return {session, lines: sanitizeLines(session.get('lines') ?? []), discountCode};
}

/**
 * Persiste líneas (y opcionalmente el código) y devuelve la cabecera Set-Cookie.
 * @param {import('react-router').Session} session
 * @param {Array} lines
 * @param {{discountCode?: string|null}} [options]
 */
export async function commitCart(session, lines, {discountCode} = {}) {
  session.set('lines', toStorage(lines));
  if (discountCode !== undefined) {
    if (discountCode) session.set('discountCode', discountCode);
    else session.unset('discountCode');
  }
  return getStorage().commitSession(session);
}

/** Vacía el carrito (tras un pago aprobado). */
export async function clearCartCookie(request) {
  const {session} = await readCartSession(request);
  session.set('lines', []);
  session.unset('discountCode');
  return getStorage().commitSession(session);
}

/**
 * Carrito hidratado para loaders.
 * @param {Request} request
 */
export async function loadCart(request) {
  const {lines, discountCode} = await readCartSession(request);
  return buildCart(lines, {discountCode});
}
