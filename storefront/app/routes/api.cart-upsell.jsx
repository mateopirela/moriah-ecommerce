/**
 * Resource route: devuelve productos sugeridos para el upsell del carrito.
 * GET /api/cart-upsell?exclude=handle1,handle2
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const exclude = (url.searchParams.get('exclude') ?? '')
    .split(',')
    .filter(Boolean);

  const {products} = await context.storefront.query(UPSELL_PRODUCTS_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  const suggestions = (products?.nodes ?? [])
    .filter((product) => !exclude.includes(product.handle))
    .filter((product) => product.selectedOrFirstAvailableVariant?.availableForSale)
    .slice(0, 2);

  return Response.json(
    {products: suggestions},
    {headers: {'Cache-Control': 'public, max-age=300'}},
  );
}

const UPSELL_PRODUCTS_QUERY = `#graphql
  query CartUpsellProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        id
        handle
        title
        featuredImage {
          id
          url
          altText
          width
          height
        }
        selectedOrFirstAvailableVariant(
          selectedOptions: []
          ignoreUnknownOptions: true
          caseInsensitiveMatch: true
        ) {
          id
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
