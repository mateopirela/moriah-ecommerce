import {redirect, useLoaderData, useSearchParams} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {CafeCard} from '~/components/CafeCard';
import {BundleCard} from '~/components/BundleCard';
import {CAFES} from '~/data/cafes';

// Handles that should fall back to the local café catalog when Shopify
// doesn't have the collection yet.
const SEED_HANDLES = ['cafes', 'all'];

const SORT_OPTIONS = [
  {key: 'featured', label: 'Destacados', sortKey: 'COLLECTION_DEFAULT', reverse: false},
  {key: 'best', label: 'Más vendidos', sortKey: 'BEST_SELLING', reverse: false},
  {key: 'price-asc', label: 'Precio: menor', sortKey: 'PRICE', reverse: false},
  {key: 'price-desc', label: 'Precio: mayor', sortKey: 'PRICE', reverse: true},
  {key: 'new', label: 'Novedades', sortKey: 'CREATED', reverse: true},
];

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const c = data?.collection;
  return [
    {title: `${c?.title ?? 'Cafés'} · MORIAH Café`},
    {
      name: 'description',
      content:
        c?.description?.slice(0, 160) ||
        'Cafés colombianos de especialidad, tostados de forma artesanal.',
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const sortParam = url.searchParams.get('sort') || 'featured';
  const sort =
    SORT_OPTIONS.find((s) => s.key === sortParam) || SORT_OPTIONS[0];

  const paginationVariables = getPaginationVariables(request, {pageBy: 9});

  if (!handle) {
    throw redirect('/collections');
  }

  const {collection} = await storefront
    .query(COLLECTION_QUERY, {
      variables: {
        handle,
        sortKey: sort.sortKey,
        reverse: sort.reverse,
        ...paginationVariables,
      },
    })
    .catch(() => ({collection: null}));

  const shopifyHasProducts = collection?.products?.nodes?.length > 0;

  // Fall back to the local café catalog so we never 404 (or show demo
  // products) before the Shopify `cafes` collection is set up.
  if (!shopifyHasProducts && SEED_HANDLES.includes(handle)) {
    return {seed: true, activeSort: sort.key};
  }

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection, activeSort: sort.key};
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();

  if (data.seed) {
    return <SeedCollection />;
  }

  return <ShopifyCollection collection={data.collection} activeSort={data.activeSort} />;
}

/** Local café catalog view (pre-Shopify). */
function SeedCollection() {
  return (
    <div className="collection">
      <section className="collection-hero">
        <div className="container collection-hero__inner">
          <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
            Selección de especialidad
          </span>
          <h1 className="display-h2">Nuestros Cafés</h1>
          <p className="lede" style={{color: 'rgba(247,243,234,0.8)'}}>
            Ediciones de especialidad y blends únicos, cultivados con intención
            y respeto por la tierra. Café 100% colombiano.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="collection-toolbar">
          <span className="collection-count">{CAFES.length + 1} productos</span>
        </div>
        <div className="products-grid">
          {CAFES.map((cafe, i) => (
            <CafeCard key={cafe.handle} cafe={cafe} loading={i < 3 ? 'eager' : 'lazy'} />
          ))}
          <BundleCard />
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{collection: any, activeSort: string}}
 */
function ShopifyCollection({collection, activeSort}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const onSort = (key) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', key);
    next.delete('cursor');
    next.delete('direction');
    setSearchParams(next, {preventScrollReset: true});
  };

  return (
    <div className="collection">
      <section className="collection-hero">
        <div className="container collection-hero__inner">
          <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
            Selección de especialidad
          </span>
          <h1 className="display-h2">{collection.title}</h1>
          {collection.description && (
            <p className="lede" style={{color: 'rgba(247,243,234,0.8)'}}>
              {collection.description}
            </p>
          )}
        </div>
      </section>

      <div className="container">
        <div className="collection-toolbar">
          <div className="filter-pills" role="group" aria-label="Ordenar">
            {SORT_OPTIONS.map((s) => (
              <button
                key={s.key}
                className="filter-pill"
                aria-pressed={activeSort === s.key}
                onClick={() => onSort(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <span className="collection-count">
            {collection.products.nodes.length} productos
          </span>
        </div>

        <PaginatedResourceSection
          connection={collection.products}
          resourcesClassName="products-grid"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 6 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {id: collection.id, handle: collection.handle},
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    vendor
    tags
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
