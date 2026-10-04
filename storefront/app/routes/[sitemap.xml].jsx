import {COLLECTION_HANDLES, allProducts} from '~/lib/catalog';
import {POLICY_HANDLES} from '~/data/policies';
import {siteUrl} from '~/lib/env.server';
import {ARTICULOS} from '~/data/articulos';

const STATIC_PATHS = [
  '/',
  '/quiz',
  '/memoria',
  '/suscripcion',
  '/conocenos',
  '/blog',
];

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({request}) {
  const origin = siteUrl(request);
  const urls = [
    ...STATIC_PATHS,
    ...COLLECTION_HANDLES.map((h) => `/collections/${h}`),
    ...allProducts().map((p) => `/products/${p.handle}`),
    ...POLICY_HANDLES.map((h) => `/policies/${h}`),
    ...ARTICULOS.map((a) => `/blog/${a.handle}`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}
