import {redirect, useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {CAFES, getCafe, formatCop} from '~/data/cafes';
import {useReveal} from '~/lib/useReveal';
import {IconArrowRight} from '~/components/Icons';

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

// Imágenes curadas por colección — las imágenes de Shopify traen texto
// horneado que se corta mal en el banner; preferimos arte propio.
const BANNER_IMAGES = {
  cafes: '/images/lineup-bolsas.webp',
  'linea-origen': '/images/hero-lifestyle.webp',
  'micro-lotes': '/images/tostado-moriah.webp',
  'club-de-la-memoria': '/images/cafe-bolsa.webp',
  'kit-el-legado': '/images/kit-bolsas.webp',
};

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

/** ─── Banner de colección — redondeado, mismo lenguaje que la tienda ─── */
function CollectionBanner({title, description, handle}) {
  const image = BANNER_IMAGES[handle] || '/images/hero-lifestyle.webp';
  return (
    <div className="tx-container">
      <header className="tx-shop-banner" data-reveal>
        <img
          src={image}
          alt={title}
          width={1400}
          height={525}
          className="tx-shop-banner__img"
          fetchPriority="high"
          decoding="async"
        />
        <div className="tx-shop-banner__overlay">
          <span className="tx-shop-banner__eyebrow">Nuestros cafés</span>
          <h1 className="tx-display tx-shop-banner__title">{title}</h1>
          {description && (
            <p className="tx-shop-banner__desc">{description}</p>
          )}
        </div>
      </header>
    </div>
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
  // Enriquecemos la card con el catálogo local (notas, tueste, badge)
  // mientras esos datos no vivan como metafields en Shopify. Fallback por
  // título porque algún handle del seed difiere del de Shopify.
  const seedInfo =
    getCafe(product.handle) ??
    CAFES.find(
      (c) => c.title.toLowerCase() === product.title.toLowerCase(),
    );

  return (
    <Link
      to={`/products/${product.handle}`}
      className="tx-col-card"
      data-reveal-child
      prefetch="intent"
    >
      <div className="tx-col-card__media">
        {seedInfo?.badge && (
          <span className="tx-col-card__badge">{seedInfo.badge}</span>
        )}
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
        <span className="tx-col-card__cta" aria-hidden="true">
          Ver café <IconArrowRight width={14} height={14} />
        </span>
      </div>
      <div className="tx-col-card__info">
        <h2 className="tx-col-card__name">{product.title}</h2>
        {seedInfo?.notes && (
          <p className="tx-col-card__notes">{seedInfo.notes}</p>
        )}
        {seedInfo?.roast && (
          <span className="tx-col-card__roast">{seedInfo.roast}</span>
        )}
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
    <Link
      to={`/products/${cafe.handle}`}
      className="tx-col-card"
      data-reveal-child
      prefetch="intent"
    >
      <div className="tx-col-card__media">
        {cafe.badge && (
          <span className="tx-col-card__badge">{cafe.badge}</span>
        )}
        <img
          src={cafe.image}
          alt={cafe.title}
          width={600}
          height={600}
          loading={index < 4 ? 'eager' : 'lazy'}
          className="tx-col-card__img tx-col-card__img--primary"
        />
        <span className="tx-col-card__cta" aria-hidden="true">
          Ver café <IconArrowRight width={14} height={14} />
        </span>
      </div>
      <div className="tx-col-card__info">
        <h2 className="tx-col-card__name">{cafe.title}</h2>
        {cafe.notes && <p className="tx-col-card__notes">{cafe.notes}</p>}
        {cafe.roast && <span className="tx-col-card__roast">{cafe.roast}</span>}
        <div className="tx-col-card__price">{formatCop(cafe.price)}</div>
      </div>
    </Link>
  );
}

/** ─── "También te puede interesar" — 3 large category blocks ─────────── */
function TambienTeInteresa() {
  const items = [
    {
      label: 'Toda la tienda',
      sub: 'Cafés, kits y merch',
      to: '/collections/all',
      img: '/images/cafe-cafes.webp',
    },
    {
      label: 'Kit El Legado',
      sub: 'El ritual completo',
      to: '/products/kit-tres-origenes',
      img: '/images/kit-bolsas.webp',
    },
    {
      label: 'Club de la Memoria',
      sub: 'Suscripción −15%',
      to: '/collections/club-de-la-memoria',
      img: '/images/lineup-bolsas.webp',
    },
  ];
  return (
    <section className="tx-section tx-tambien">
      <div className="tx-container">
        <h2 className="tx-display tx-h2 tx-tambien__title" data-reveal>
          También te puede interesar
        </h2>
        <div className="tx-tambien__grid" data-reveal>
          {items.map((it) => (
            <Link
              key={it.label}
              to={it.to}
              className="tx-tambien__card"
              data-reveal-child
            >
              <img
                src={it.img}
                alt={it.label}
                width={800}
                height={600}
                loading="lazy"
                className="tx-tambien__img"
              />
              <div className="tx-tambien__overlay">
                <span className="tx-tambien__sub">{it.sub}</span>
                <span className="tx-display tx-h3 tx-tambien__label">
                  {it.label}
                </span>
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
  useReveal();
  return (
    <div className="tx tx-collection-page">
      <CollectionBanner
        title="Nuestros Cafés"
        description="Café 100% colombiano de especialidad, cultivado con intención y respeto por la tierra."
        handle={handle}
      />
      <CategoryPills activeHandle={handle} />
      <section className="tx-section">
        <div className="tx-container">
          <div className="tx-col-grid" data-reveal>
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
  useReveal();
  return (
    <div className="tx tx-collection-page">
      <CollectionBanner
        title={collection.title}
        description={collection.description}
        handle={handle}
      />
      <CategoryPills activeHandle={handle} />
      <section className="tx-section">
        <div className="tx-container">
          <div data-reveal>
            <PaginatedResourceSection
              connection={collection.products}
              resourcesClassName="tx-col-grid"
            >
              {({node: product, index}) => (
                <TxProductCard key={product.id} product={product} index={index} />
              )}
            </PaginatedResourceSection>
          </div>
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
