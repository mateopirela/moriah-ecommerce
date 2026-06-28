import {redirect, useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {CAFES, formatCop} from '~/data/cafes';

// Handles that fall back to local catalog before Shopify collection is ready
const SEED_HANDLES = ['cafes', 'all'];

// Category filters — mirrors Tropicalia's horizontal pill nav
const CAFE_FILTERS = [
  {handle: 'cafes', label: 'Todos'},
  {handle: 'linea-origen', label: 'Línea de Origen'},
  {handle: 'micro-lotes', label: 'Micro-lotes'},
  {handle: 'club-de-la-memoria', label: 'Club de la Memoria'},
  {handle: 'kit-el-legado', label: 'Kit El Legado'},
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

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  if (!handle) {
    throw redirect('/collections');
  }

  const {collection} = await storefront
    .query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
    })
    .catch(() => ({collection: null}));

  const shopifyHasProducts = collection?.products?.nodes?.length > 0;

  if (!shopifyHasProducts && SEED_HANDLES.includes(handle)) {
    return {seed: true, handle};
  }

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {collection, handle};
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  const data = useLoaderData();

  if (data.seed) {
    return <SeedCollection handle={data.handle} />;
  }

  return <ShopifyCollection collection={data.collection} handle={data.handle} />;
}

/** ─── Tropicalia-style collection banner ─────────────────────────────── */
function CollectionBanner({title, description, image}) {
  return (
    <section className="tx-cat-banner">
      <img
        src={image || '/images/hero-lifestyle.webp'}
        alt={title}
        width={1920}
        height={600}
        className="tx-cat-banner__img"
        fetchPriority="high"
        decoding="async"
      />
      <div className="tx-cat-banner__overlay">
        <h1 className="tx-display tx-cat-banner__title">{title}</h1>
        {description && (
          <p className="tx-cat-banner__desc">{description}</p>
        )}
      </div>
    </section>
  );
}

/** ─── Category pill navigation (Tropicalia: .div-block-385) ─────────── */
function CategoryPills({activeHandle}) {
  return (
    <nav className="tx-cat-pills" aria-label="Categorías">
      <div className="tx-container">
        <div className="tx-cat-pills__row">
          {CAFE_FILTERS.map((f) => (
            <Link
              key={f.handle}
              to={`/collections/${f.handle}`}
              className={`tx-cat-pill${activeHandle === f.handle ? ' tx-cat-pill--active' : ''}`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

/** ─── Product card with hover-swap image (Tropicalia: .cont-img-producto) */
function TxProductCard({product, index}) {
  const price = product.priceRange?.minVariantPrice;
  const images = product.images?.nodes ?? [];
  const img1 = images[0]?.url ?? product.featuredImage?.url ?? '/images/cafe-bolsa.webp';
  const img2 = images[1]?.url ?? null;
  const unavailable = product.availableForSale === false;

  return (
    <Link
      to={`/products/${product.handle}`}
      className="tx-col-card"
      prefetch="intent"
    >
      <div className="tx-col-card__media">
        <img
          src={img1}
          alt={product.title}
          width={600}
          height={600}
          loading={index < 4 ? 'eager' : 'lazy'}
          className="tx-col-card__img tx-col-card__img--primary"
        />
        {img2 && (
          <img
            src={img2}
            alt=""
            aria-hidden="true"
            width={600}
            height={600}
            loading="lazy"
            className="tx-col-card__img tx-col-card__img--hover"
          />
        )}
        {unavailable && (
          <div className="tx-col-card__sold-out">
            <span>Agotado</span>
          </div>
        )}
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

/** ─── Seed card using local CAFES data ──────────────────────────────── */
function SeedCard({cafe, index}) {
  return (
    <Link to={`/products/${cafe.handle}`} className="tx-col-card" prefetch="intent">
      <div className="tx-col-card__media">
        <img
          src={cafe.image}
          alt={cafe.title}
          width={600}
          height={600}
          loading={index < 4 ? 'eager' : 'lazy'}
          className="tx-col-card__img tx-col-card__img--primary"
        />
      </div>
      <div className="tx-col-card__info">
        <h2 className="tx-col-card__name">{cafe.title}</h2>
        <div className="tx-col-card__price">{formatCop(cafe.price)}</div>
      </div>
    </Link>
  );
}

/** ─── "También te puede interesar" — 3 large category blocks ─────────── */
function TambienTeInteresa() {
  const items = [
    {label: 'Nuestros cafés', to: '/collections/cafes', img: '/images/cafe-cafes.webp'},
    {label: 'Kit El Legado', to: '/collections/cafes', img: '/images/kit-bolsas.webp'},
    {label: 'Club de la Memoria', to: '/collections/cafes', img: '/images/lineup-bolsas.webp'},
  ];
  return (
    <section className="tx-section tx-tambien">
      <div className="tx-container">
        <h2 className="tx-display tx-h2 tx-tambien__title">
          También te puede interesar
        </h2>
        <div className="tx-tambien__grid">
          {items.map((it) => (
            <Link key={it.label} to={it.to} className="tx-tambien__card">
              <img
                src={it.img}
                alt={it.label}
                width={800}
                height={600}
                loading="lazy"
                className="tx-tambien__img"
              />
              <div className="tx-tambien__overlay">
                <span className="tx-display tx-h3 tx-tambien__label">{it.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** ─── Local seed collection ─────────────────────────────────────────── */
function SeedCollection({handle}) {
  return (
    <div className="tx">
      <CollectionBanner
        title="Nuestros Cafés"
        description="Café 100% colombiano de especialidad, cultivado con intención y respeto por la tierra. Cada grano tostado artesanalmente y sellado al vacío."
      />
      <CategoryPills activeHandle={handle} />
      <section className="tx-section">
        <div className="tx-container">
          <div className="tx-col-grid">
            {CAFES.map((cafe, i) => (
              <SeedCard key={cafe.handle} cafe={cafe} index={i} />
            ))}
          </div>
        </div>
      </section>
      <TambienTeInteresa />
    </div>
  );
}

/** ─── Live Shopify collection ───────────────────────────────────────── */
function ShopifyCollection({collection, handle}) {
  return (
    <div className="tx">
      <CollectionBanner
        title={collection.title}
        description={collection.description}
        image={collection.image?.url}
      />
      <CategoryPills activeHandle={handle} />
      <section className="tx-section">
        <div className="tx-container">
          <PaginatedResourceSection
            connection={collection.products}
            resourcesClassName="tx-col-grid"
          >
            {({node: product, index}) => (
              <TxProductCard key={product.id} product={product} index={index} />
            )}
          </PaginatedResourceSection>
        </div>
      </section>
      <TambienTeInteresa />

      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
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
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
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
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image { url }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
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
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
