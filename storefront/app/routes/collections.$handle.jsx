import {Link, useLoaderData} from 'react-router';
import {IconArrowRight} from '~/components/Icons';
import {SUBSCRIPTION, formatCop, getCollection} from '~/lib/catalog';
import {useReveal} from '~/lib/useReveal';

// Pills de navegación para las colecciones de café
const CAFE_FILTERS = [
  {handle: 'cafes', label: 'Todos'},
  {handle: 'linea-origen', label: 'Línea de Origen'},
  {handle: 'micro-lotes', label: 'Micro-lotes'},
  {handle: 'club-de-la-memoria', label: 'Club de la Memoria'},
  {handle: 'kit-el-legado', label: 'Kit El Legado'},
];

// Pills para la tienda completa / merch
const SHOP_FILTERS = [
  {handle: 'all', label: 'Todos'},
  {handle: 'cafes', label: 'Cafés'},
  {handle: 'merch', label: 'Merch'},
  {handle: 'pocillos', label: 'Pocillos'},
  {handle: 'para-vestir', label: 'Para vestir'},
  {handle: 'accesorios', label: 'Accesorios'},
  {handle: 'caja-regalo', label: 'Caja regalo'},
];

// Imágenes curadas por colección
const BANNER_IMAGES = {
  all: '/images/cafe-cafes.webp',
  cafes: '/images/lineup-bolsas.webp',
  'linea-origen': '/images/hero-lifestyle.webp',
  'micro-lotes': '/images/tostado-moriah.webp',
  'club-de-la-memoria': '/images/cafe-bolsa.webp',
  'kit-el-legado': '/images/kit-bolsas.webp',
  merch: '/images/equipo-moriah.webp',
};

/** @type {import('react-router').MetaFunction} */
export const meta = ({data}) => {
  const c = data?.collection;
  return [
    {title: `${c?.title ?? 'Tienda'} · MORIAH Café`},
    {
      name: 'description',
      content:
        c?.description ?? 'Cafés colombianos de especialidad, tostados de forma artesanal.',
    },
  ];
};

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({params}) {
  const collection = getCollection(params.handle);
  if (!collection) {
    throw new Response(`Colección ${params.handle} no encontrada`, {status: 404});
  }
  return {collection};
}

export default function Collection() {
  const {collection} = useLoaderData();
  useReveal();
  const isShop = SHOP_FILTERS.some((f) => f.handle === collection.handle) && collection.handle !== 'cafes';
  const filters = isShop ? SHOP_FILTERS : CAFE_FILTERS;

  return (
    <div className="tx tx-collection-page">
      <CollectionBanner collection={collection} />
      <CategoryPills filters={filters} activeHandle={collection.handle} />
      {collection.club && <ClubNote />}
      <section className="tx-section">
        <div className="tx-container">
          <div className="tx-col-grid" data-reveal>
            {collection.products.map((product, i) => (
              <ProductCard
                key={product.handle}
                product={product}
                index={i}
                club={collection.club}
              />
            ))}
          </div>
          {collection.products.length === 0 && (
            <p className="tx-lede">Pronto habrá novedades en esta colección.</p>
          )}
        </div>
      </section>
      <TambienTeInteresa />
    </div>
  );
}

function CollectionBanner({collection}) {
  const image = BANNER_IMAGES[collection.handle] || '/images/hero-lifestyle.webp';
  return (
    <div className="tx-container">
      <header className="tx-shop-banner" data-reveal>
        <img
          src={image}
          alt={collection.title}
          width={1400}
          height={525}
          className="tx-shop-banner__img"
          fetchpriority="high"
          decoding="async"
        />
        <div className="tx-shop-banner__overlay">
          <span className="tx-shop-banner__eyebrow">{collection.eyebrow}</span>
          <h1 className="tx-display tx-shop-banner__title">{collection.title}</h1>
          {collection.description && (
            <p className="tx-shop-banner__desc">{collection.description}</p>
          )}
        </div>
      </header>
    </div>
  );
}

function CategoryPills({filters, activeHandle}) {
  return (
    <nav className="tx-cat-pills" aria-label="Categorías">
      <div className="tx-container">
        <div className="tx-cat-pills__row">
          {filters.map((f) => (
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

function ClubNote() {
  const perks = SUBSCRIPTION.perks;
  return (
    <section className="tx-section" style={{paddingBottom: 0}}>
      <div className="tx-container">
        <div className="club-note" data-reveal>
          <div>
            <span className="eyebrow">Club de la Memoria</span>
            <h2 className="display-h3">Tu café, en casa, cuando lo necesitas</h2>
            <ul className="sub-perks">
              {perks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <Link className="btn btn--lg" to="/suscripcion">
            Armar mi suscripción
            <IconArrowRight className="btn-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({product, index, club}) {
  const to = club && product.subscribable
    ? `/suscripcion?cafe=${product.handle}`
    : `/products/${product.handle}`;
  const price = club && product.subscribable
    ? Math.round((product.price * (1 - SUBSCRIPTION.discount)) / 100) * 100
    : product.price;
  return (
    <Link to={to} className="tx-col-card" data-reveal-child prefetch="intent">
      <div className="tx-col-card__media">
        {product.badge && <span className="tx-col-card__badge">{product.badge}</span>}
        <img
          src={product.image}
          alt={product.title}
          width={600}
          height={600}
          loading={index < 4 ? 'eager' : 'lazy'}
          className="tx-col-card__img tx-col-card__img--primary"
        />
        <span className="tx-col-card__cta" aria-hidden="true">
          {club ? 'Suscribirme' : product.kind === 'cafe' ? 'Ver café' : 'Ver producto'}{' '}
          <IconArrowRight width={14} height={14} />
        </span>
      </div>
      <div className="tx-col-card__info">
        <h2 className="tx-col-card__name">{product.title}</h2>
        {product.notes && <p className="tx-col-card__notes">{product.notes}</p>}
        {product.kind === 'merch' && product.short && (
          <p className="tx-col-card__notes">{product.short}</p>
        )}
        {product.roast && <span className="tx-col-card__roast">{product.roast}</span>}
        <div className="tx-col-card__price">
          {formatCop(price)}
          {club && product.subscribable && <small> / entrega</small>}
        </div>
      </div>
    </Link>
  );
}

function TambienTeInteresa() {
  const items = [
    {label: 'Toda la tienda', sub: 'Cafés, kits y merch', to: '/collections/all', img: '/images/cafe-cafes.webp'},
    {label: 'Kit El Legado', sub: 'El ritual completo', to: '/products/kit-tres-origenes', img: '/images/kit-bolsas.webp'},
    {label: 'Club de la Memoria', sub: 'Suscripción −15%', to: '/collections/club-de-la-memoria', img: '/images/lineup-bolsas.webp'},
  ];
  return (
    <section className="tx-section tx-tambien">
      <div className="tx-container">
        <h2 className="tx-display tx-h2 tx-tambien__title" data-reveal>
          También te puede interesar
        </h2>
        <div className="tx-tambien__grid" data-reveal>
          {items.map((it) => (
            <Link key={it.label} to={it.to} className="tx-tambien__card" data-reveal-child>
              <img src={it.img} alt={it.label} width={800} height={600} loading="lazy" className="tx-tambien__img" />
              <div className="tx-tambien__overlay">
                <span className="tx-tambien__sub">{it.sub}</span>
                <span className="tx-display tx-h3 tx-tambien__label">{it.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
