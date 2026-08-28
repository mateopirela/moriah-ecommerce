import {siteUrl} from '~/lib/env.server';

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({request}) {
  const sitemapUrl = `${siteUrl(request)}/sitemap.xml`;
  const body = `User-agent: *
Disallow: /cart
Disallow: /checkout
Disallow: /suscripcion/gestionar
Disallow: /api/
Disallow: /search
Sitemap: ${sitemapUrl}
`;
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}
