/**
 * Vercel Edge Function entry for the Hydrogen storefront.
 *
 * Hydrogen builds an Oxygen-style worker (`export default {fetch(request, env, ctx)}`).
 * Vercel's Edge Runtime instead calls `handler(request, context)`, exposes env vars on
 * `process.env`, and has no `caches` API. This file adapts one signature to the other;
 * `app/lib/context.js` handles the missing Cache API with Hydrogen's InMemoryCache.
 *
 * Bundled by `scripts/vercel-build.mjs` into `.vercel/output/functions/index.func/index.js`.
 */
import worker from '../dist/server/index.js';

export default async function handler(request, context) {
  const env =
    typeof process !== 'undefined' && process.env ? process.env : {};

  /** @type {ExecutionContext} */
  const executionContext = {
    waitUntil(promise) {
      if (context && typeof context.waitUntil === 'function') {
        context.waitUntil(promise);
      }
    },
    passThroughOnException() {},
  };

  return worker.fetch(request, env, executionContext);
}
