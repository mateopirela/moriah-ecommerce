import {Link, useLoaderData} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {formatCop} from '~/data/cafes';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Tienda · MORIAH Café'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();

  return (
    <div className="tx tx-shop-page">
      <section className="tx-section">
        <div className="tx-container">
          <header className="tx-shop-banner">
            <img
              src="/images/cafe-cafes.webp"
              alt="La tienda de MORIAH Café"
              width={1400}
              height={1350}
              className="tx-shop-banner__img"
              fetchPriority="high"
              decoding="async"
            />
            <div className="tx-shop-banner__overlay">
              <span className="tx-shop-banner__eyebrow">Nuestra tienda</span>
              <h1 className="tx-display tx-shop-banner__title">
                Todos los productos
              </h1>
            </div>
          </header>
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="tx-col-grid"
          >
            {({node: product, index}) => (
              <AllProductCard
                key={product.id}
                product={product}
                index={index}
              />
            )}
          </PaginatedResourceSection>
        </div>
      </section>
    </div>
  );
}

/**
 * Tarjeta de producto estilo Tropicalia: imagen cuadrada + nombre y precio
 * debajo, sin caja/tarjeta. Reutiliza los estilos `tx-col-card`.
 * @param {{product: CollectionItemFragment, index: number}}
 */
function AllProductCard({product, index}) {
  const price = product.priceRange?.minVariantPrice;
  const image = product.featuredImage;
  return (
    <Link
      to={`/products/${product.handle}`}
      className="tx-col-card"
      prefetch="intent"
    >
      <div className="tx-col-card__media">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || product.title}
            width={600}
            height={600}
            loading={index < 8 ? 'eager' : 'lazy'}
            className="tx-col-card__img tx-col-card__img--primary"
          />
        ) : null}
      </div>
      <div className="tx-col-card__info">
        <h2 className="tx-col-card__name">{product.title}</h2>
        {price && (
          <div className="tx-col-card__price">
            {formatCop(Number(price.amount))}
          </div>
        )}
      </div>
    </Link>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;

/** @typedef {import('./+types/collections.all').Route} Route */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
