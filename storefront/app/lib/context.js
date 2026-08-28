import {createHydrogenContext, InMemoryCache} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {createKlaviyoClient} from '~/lib/integrations/klaviyo';

/**
 * Creates additional context with 3P integrations.
 * Safely handles missing secrets (graceful degradation).
 */
function createAdditionalContext(env) {
  return {
    // Klaviyo email + community client
    klaviyo: createKlaviyoClient(
      env.KLAVIYO_PRIVATE_KEY,
      env.KLAVIYO_COMMUNITY_LIST_ID,
    ),
  };
}

/**
 * Opens the worker Cache API when the runtime provides it (Oxygen / workerd).
 * Other edge runtimes (e.g. Vercel) don't expose `caches`, so fall back to
 * Hydrogen's in-memory cache to keep Storefront API sub-request caching working.
 * @return {Promise<Cache>}
 */
async function openCache() {
  if (typeof caches !== 'undefined' && typeof caches.open === 'function') {
    try {
      return await caches.open('hydrogen');
    } catch {
      // fall through to the in-memory cache
    }
  }
  return new InMemoryCache();
}

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 * @param {Request} request
 * @param {Env} env
 * @param {ExecutionContext} executionContext
 */
export async function createHydrogenRouterContext(
  request,
  env,
  executionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil =
    typeof executionContext?.waitUntil === 'function'
      ? executionContext.waitUntil.bind(executionContext)
      : () => {};
  const [cache, session] = await Promise.all([
    openCache(),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const additionalContext = createAdditionalContext(env);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // Or detect from URL path based on locale subpath, cookies, or any other strategy
      i18n: {language: 'EN', country: 'US'},
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext,
  );

  return hydrogenContext;
}

/** @typedef {Class<additionalContext>} AdditionalContextType */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
