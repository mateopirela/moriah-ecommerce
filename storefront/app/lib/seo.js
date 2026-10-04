/**
 * Etiquetas SEO y de vista previa al compartir (Open Graph y Twitter Card).
 * Las direcciones deben ser ABSOLUTAS: WhatsApp, Instagram y Facebook ignoran las
 * rutas relativas. `origin` viene del loader (`siteUrl(request)`).
 */
export const DEFAULT_OG_IMAGE = '/images/og-moriah.jpg';

/** @param {string} origin @param {string} path */
export function absoluteUrl(origin, path) {
  if (!path) return origin;
  if (/^https?:\/\//.test(path)) return path;
  return `${origin.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * @param {{
 *   origin: string, path: string, title: string, description: string,
 *   image?: string, imageAlt?: string, type?: 'website' | 'article',
 * }} input
 */
export function seoMeta({
  origin,
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  imageAlt = 'MORIAH Café: café de especialidad colombiano',
  type = 'website',
}) {
  const url = absoluteUrl(origin, path);
  const img = absoluteUrl(origin, image);
  return [
    {title},
    {name: 'description', content: description},
    {tagName: 'link', rel: 'canonical', href: url},
    {property: 'og:site_name', content: 'MORIAH Café'},
    {property: 'og:locale', content: 'es_CO'},
    {property: 'og:type', content: type},
    {property: 'og:url', content: url},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:image', content: img},
    {property: 'og:image:alt', content: imageAlt},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: img},
  ];
}
