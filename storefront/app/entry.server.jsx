import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} reactRouterContext
 * @param {HydrogenRouterContextProvider} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Tipografías de marca: Satoshi (Fontshare) + Fraunces (Google Fonts).
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://fonts.googleapis.com',
      'https://api.fontshare.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com',
      'https://cdn.fontshare.com',
      'data:',
    ],
    // Analytics: GA4 + Meta Pixel (dormant unless env IDs are set).
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://www.googletagmanager.com',
      'https://connect.facebook.net',
    ],
    connectSrc: [
      "'self'",
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
      'https://www.facebook.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://www.google-analytics.com',
      'https://www.facebook.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/hydrogen').HydrogenRouterContextProvider} HydrogenRouterContextProvider */
/** @typedef {import('react-router').EntryContext} EntryContext */
