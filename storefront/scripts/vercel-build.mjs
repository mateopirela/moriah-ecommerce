/**
 * Emits a Vercel Build Output API (v3) directory for the Hydrogen storefront.
 *
 * Run AFTER `npm run build` (which produces `dist/client` + `dist/server/index.js`):
 *   node scripts/vercel-build.mjs
 *
 * Result (at the repo root, where Vercel's Root Directory points):
 *   .vercel/output/config.json                 routing: static first, then the edge function
 *   .vercel/output/static/**                   copied from dist/client
 *   .vercel/output/functions/index.func/       single-file Edge Function (wrapper + server bundle)
 */
import {build} from 'esbuild';
import {cpSync, existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const storefrontDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(storefrontDir, '..');
const distClient = resolve(storefrontDir, 'dist/client');
const distServer = resolve(storefrontDir, 'dist/server/index.js');
const outDir = resolve(repoRoot, '.vercel/output');
const staticDir = resolve(outDir, 'static');
const funcDir = resolve(outDir, 'functions/index.func');

if (!existsSync(distClient) || !existsSync(distServer)) {
  console.error(
    '[vercel-build] dist/ is missing. Run `npm run build` before this script.',
  );
  process.exit(1);
}

rmSync(outDir, {recursive: true, force: true});
mkdirSync(funcDir, {recursive: true});

// 1. Static assets. Node's native cpSync ignores `filter` for files, so drop the
//    Oxygen-only metadata explicitly after copying.
cpSync(distClient, staticDir, {recursive: true});
for (const name of ['oxygen.json', '.gitkeep']) {
  rmSync(resolve(staticDir, name), {force: true});
}

// 2. Edge Function: bundle the adapter + the already-built Hydrogen worker into one file.
await build({
  entryPoints: [resolve(storefrontDir, 'scripts/vercel-entry.js')],
  outfile: resolve(funcDir, 'index.js'),
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  mainFields: ['module', 'main'],
  conditions: ['workerd', 'worker', 'browser'],
  minify: false,
  legalComments: 'none',
  logLevel: 'warning',
});

writeFileSync(
  resolve(funcDir, '.vc-config.json'),
  JSON.stringify({runtime: 'edge', entrypoint: 'index.js'}, null, 2),
);

// 3. Routing config: hashed assets are immutable; anything not on disk goes to the function.
writeFileSync(
  resolve(outDir, 'config.json'),
  JSON.stringify(
    {
      version: 3,
      routes: [
        {
          src: '^/assets/(.*)$',
          headers: {'cache-control': 'public, max-age=31536000, immutable'},
          continue: true,
        },
        {handle: 'filesystem'},
        {src: '^/(.*)$', dest: '/index'},
      ],
    },
    null,
    2,
  ),
);

// eslint-disable-next-line no-console
console.log(`[vercel-build] Build Output written to ${outDir}`);
