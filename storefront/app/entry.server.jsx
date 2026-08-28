import {PassThrough} from 'node:stream';
import {randomBytes} from 'node:crypto';
import {createReadableStreamFromReadable} from '@react-router/node';
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToPipeableStream} from 'react-dom/server';
import {NonceProvider} from '~/lib/nonce';

export const streamTimeout = 5_000;

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {import('react-router').EntryContext} routerContext
 */
export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  routerContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');
    const waitForAll = (userAgent && isbot(userAgent)) || routerContext.isSpaMode;
    const nonce = randomBytes(16).toString('base64');

    const {pipe, abort} = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <ServerRouter context={routerContext} url={request.url} nonce={nonce} />
      </NonceProvider>,
      {
        nonce,
        [waitForAll ? 'onAllReady' : 'onShellReady']() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');
          if (process.env.NODE_ENV === 'production') {
            responseHeaders.set('Content-Security-Policy', contentSecurityPolicy(nonce));
          }

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) console.error(error);
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}

/**
 * CSP de producción. Permite las fuentes de marca, GA4/Meta (si se configuran)
 * y la API de Wompi para tokenizar tarjetas desde el navegador.
 * @param {string} nonce
 */
function contentSecurityPolicy(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://connect.facebook.net`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
    "font-src 'self' data: https://fonts.gstatic.com https://cdn.fontshare.com",
    "img-src 'self' data: blob: https://www.google-analytics.com https://www.facebook.com",
    "media-src 'self'",
    "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.facebook.com https://production.wompi.co https://sandbox.wompi.co",
    "form-action 'self' https://checkout.wompi.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; ');
}
