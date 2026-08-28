import {upsellSuggestions} from '~/lib/catalog';

/**
 * Resource route: productos sugeridos para el upsell del carrito.
 * GET /api/cart-upsell?exclude=handle1,handle2
 * @param {import('react-router').LoaderFunctionArgs} args
 */
export async function loader({request}) {
  const url = new URL(request.url);
  const exclude = (url.searchParams.get('exclude') ?? '').split(',').filter(Boolean);
  const products = upsellSuggestions(exclude, 2).map(publicProduct);
  return Response.json({products}, {headers: {'Cache-Control': 'public, max-age=300'}});
}

function publicProduct(p) {
  return {handle: p.handle, title: p.title, price: p.price, image: p.image};
}
