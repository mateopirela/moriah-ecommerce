import {searchProducts} from '~/lib/catalog';

/**
 * Resource route: búsqueda instantánea sobre el catálogo.
 * GET /api/search?q=pacamara
 * @param {import('react-router').LoaderFunctionArgs} args
 */
export async function loader({request}) {
  const q = new URL(request.url).searchParams.get('q') ?? '';
  const products = searchProducts(q)
    .slice(0, 6)
    .map((p) => ({handle: p.handle, title: p.title, price: p.price, image: p.image}));
  return Response.json({q, products}, {headers: {'Cache-Control': 'public, max-age=300'}});
}
