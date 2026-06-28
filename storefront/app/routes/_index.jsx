import {useLoaderData, Link} from 'react-router';
import {SUBSCRIPTION, formatCop} from '~/data/cafes';
import {MERCH} from '~/data/merch';

/**
 * Homepage — réplica de la estructura/diseño de tropicaliacoffee.com,
 * vestida con la marca MORIAH. Toda la maquetación vive bajo `.tx`
 * (ver app/styles/tropicalia.css), independiente del tema base.
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'MORIAH Café · Un café para el alma'},
    {
      name: 'description',
      content:
        'Café 100% colombiano de especialidad, tostado artesanal y sellado al vacío. Un café para el alma. Envío gratis desde $100.000.',
    },
    {property: 'og:title', content: 'MORIAH Café · Un café para el alma'},
    {property: 'og:type', content: 'website'},
    {property: 'og:image', content: '/images/hero-lifestyle.webp'},
  ];
};

/** @param {Route.LoaderArgs} args */
export async function loader(args) {
  const data = await args.context.storefront
    .query(HOME_QUERY)
    .catch(() => ({cafes: null, merch: null}));
  return {
    cafes: data?.cafes?.products?.nodes ?? null,
    merch: data?.merch?.products?.nodes ?? null,
  };
}

export default function Homepage() {
  /** @type {{cafes: any[] | null, merch: any[] | null}} */
  const {cafes, merch} = useLoaderData();
  return (
    <div className="tx">
      <Hero />
      <CollectionsSection />
      <CafesSection products={cafes} />
      <SubscriptionSection />
      <MerchSection products={merch} />
      <GallerySection />
      <RitualsSection />
    </div>
  );
}

/* ------------------------------- HERO ------------------------------- */
/** Split full-bleed banner (Tropicalia "banner-inicio"). */
function Hero() {
  return (
    <section className="tx-hero">
      <div className="tx-hero__media">
        <img
          src="/images/hero-lifestyle.webp"
          alt="Café MORIAH en la mano — Un café para el alma"
          width={1100}
          height={1375}
          fetchPriority="high"
          decoding="async"
        />
        <div className="tx-hero__overlay">
          <span className="tx-eyebrow" style={{color: 'var(--tx-gold)'}}>
            Un tributo a la memoria
          </span>
          <h1 className="tx-display tx-h1 tx-hero__title">
            Yo no aprendí a querer el café. <em>Lo heredé.</em>
          </h1>
          <Link className="tx-btn" to="/collections/cafes">
            Conoce más
          </Link>
        </div>
      </div>
      <div className="tx-hero__media">
        <img
          src="/images/tostado-moriah.webp"
          alt="Tostado artesanal MORIAH"
          width={1100}
          height={1375}
          loading="eager"
          decoding="async"
        />
      </div>
    </section>
  );
}

/* --------------------------- COLECCIONES ---------------------------- */
/** Grid 4 columnas (Tropicalia: Trópico/Esencia/Privilegio/Vino Silvestre). */
function CollectionsSection() {
  const lines = [
    {
      title: 'Línea de Origen',
      desc: 'Cafés con propósito para tu ritual diario, cultivados con intención.',
      img: '/images/cafe-bolsa.webp',
      to: '/collections/cafes',
    },
    {
      title: 'Micro-lotes',
      desc: 'Ediciones limitadas y sublimes. Lo extraordinario en cada taza.',
      img: '/images/producto-bolsa.webp',
      to: '/collections/cafes',
    },
    {
      title: 'Club de la Memoria',
      desc: 'La pausa que mereces, cada mes. Con 15% para siempre.',
      img: '/images/lineup-bolsas.webp',
      to: '/#club',
    },
    {
      title: 'Kit El Legado',
      desc: 'Molino, pocillo y café: la herramienta para heredar una tradición.',
      img: '/images/kit-bolsas.webp',
      to: '/collections/cafes',
    },
  ];
  return (
    <section className="tx-section">
      <div className="tx-container">
        <div className="tx-section-head">
          <span className="tx-eyebrow">Nuestra selección</span>
          <h2 className="tx-display tx-h2">La riqueza de nuestra tierra en tus manos</h2>
        </div>
        <div className="tx-collections">
          {lines.map((l) => (
            <article className="tx-collection-card" key={l.title}>
              <div className="tx-collection-card__media">
                <img src={l.img} alt={l.title} width={600} height={750} loading="lazy" />
              </div>
              <div className="tx-collection-card__body">
                <h3 className="tx-display tx-h3">{l.title}</h3>
                <p className="tx-collection-card__desc">{l.desc}</p>
                <Link className="tx-btn" to={l.to}>
                  Comprar ahora
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ CAFÉS ------------------------------- */
/**
 * Grid de los cafés reales de la colección `cafes` de Shopify. Solo se
 * renderiza cuando hay productos (si Shopify aún no tiene la colección, se
 * omite y la home sigue con sus secciones editoriales).
 * @param {{products: any[] | null}}
 */
function CafesSection({products}) {
  if (!products || !products.length) return null;

  return (
    <section className="tx-section">
      <div className="tx-container">
        <div className="tx-section-head">
          <span className="tx-eyebrow">Nuestra selección de especialidad</span>
          <h2 className="tx-display tx-h2">Conoce nuestros cafés</h2>
        </div>
        <div className="tx-products">
          {products.slice(0, 4).map((p) => (
            <Link
              className="tx-product-card"
              to={`/products/${p.handle}`}
              key={p.handle}
            >
              <div className="tx-product-card__media">
                <img
                  src={p.featuredImage?.url || '/images/producto-bolsa.webp'}
                  alt={p.featuredImage?.altText || p.title}
                  width={500}
                  height={500}
                  loading="lazy"
                />
              </div>
              <span className="tx-product-card__name">{p.title}</span>
              <span className="tx-product-card__price">
                {formatCop(Number(p.priceRange?.minVariantPrice?.amount ?? 0))}
              </span>
            </Link>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2.5rem'}}>
          <Link className="tx-link" to="/collections/cafes">
            Ver todos los cafés
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- SUSCRIPCIÓN ---------------------------- */
/** Split (Tropicalia "Suscríbete ahora") — Club de la Memoria. */
function SubscriptionSection() {
  return (
    <section className="tx-section tx-section--ink" id="club">
      <div className="tx-container tx-sub">
        <div className="tx-sub__media">
          <img
            src="/images/cafe-cafes.webp"
            alt="Club de la Memoria MORIAH"
            width={900}
            height={720}
            loading="lazy"
          />
        </div>
        <div className="tx-sub__body">
          <span className="tx-eyebrow" style={{color: 'var(--tx-gold)'}}>
            Suscripciones
          </span>
          <h2 className="tx-display tx-h2">Suscríbete ahora</h2>
          <p className="tx-lede">
            Cada grano lo seleccionamos cuidadosamente para llevarte lo mejor de
            la alta montaña a la calidez de tu hogar. Devuélvete el tiempo que
            importa, en la frecuencia que elijas.
          </p>
          <ul className="tx-sub__perks">
            {SUBSCRIPTION.perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <Link className="tx-btn" to="/collections/cafes">
            Suscríbete ahora
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ MERCH ------------------------------- */
/**
 * Grid 4 (Tropicalia "NUESTROS INFALTABLES"). Lee la colección `merch` real de
 * Shopify cuando existe; si no, cae al catálogo local como semilla.
 * @param {{products: any[] | null}}
 */
function MerchSection({products}) {
  const featured =
    products && products.length
      ? products.slice(0, 4).map((p) => ({
          handle: p.handle,
          title: p.title,
          image: p.featuredImage?.url || '/images/producto-bolsa.webp',
          price: Number(p.priceRange?.minVariantPrice?.amount ?? 0),
          badge: null,
        }))
      : MERCH.slice(0, 4);

  return (
    <section className="tx-section tx-section--surface">
      <div className="tx-container">
        <div className="tx-section-head">
          <span className="tx-eyebrow">Para vestir y para el ritual</span>
          <h2 className="tx-display tx-h2">Nuestros infaltables</h2>
        </div>
        <div className="tx-products">
          {featured.map((m) => (
            <Link className="tx-product-card" to={`/products/${m.handle}`} key={m.handle}>
              <div className="tx-product-card__media">
                {m.badge && <span className="tx-product-card__badge">{m.badge}</span>}
                <img src={m.image} alt={m.title} width={500} height={500} loading="lazy" />
              </div>
              <span className="tx-product-card__name">{m.title}</span>
              <span className="tx-product-card__price">{formatCop(m.price)}</span>
            </Link>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2.5rem'}}>
          <Link className="tx-link" to="/collections/merch">
            Ver todos
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- GALERÍA ------------------------------ */
/** Strip horizontal (Tropicalia "Store Gallery"). */
function GallerySection() {
  const shots = [
    '/images/monte-moriah.webp',
    '/images/tostado-moriah.webp',
    '/images/equipo-moriah.webp',
    '/images/cafe-cafes.webp',
    '/images/lineup-bolsas.webp',
    '/images/hero-lifestyle.webp',
  ];
  return (
    <section className="tx-section" style={{paddingInline: 0}}>
      <div className="tx-container tx-section-head">
        <span className="tx-eyebrow">Detrás de cada taza</span>
        <h2 className="tx-display tx-h2">Un lujo tropical, hecho en Colombia</h2>
      </div>
      <div className="tx-gallery">
        {shots.map((src, i) => (
          <img key={src} src={src} alt={`MORIAH ${i + 1}`} width={400} height={533} loading="lazy" />
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- RITUALES ----------------------------- */
/** Grid 3 (Tropicalia menú "INSPIRADOS EN NUESTRO TRÓPICO"). */
function RitualsSection() {
  const rituals = [
    {
      title: 'El Tinto de la Abuela',
      img: '/images/cafe-bolsa.webp',
      desc: 'Colado en olla, bien dulce, en pocillo de peltre. La señal de que el día empieza en familia.',
    },
    {
      title: 'V60 de Origen',
      img: '/images/producto-bolsa.webp',
      desc: 'Filtrado lento para resaltar la acidez cítrica y los florales de nuestros micro-lotes.',
    },
    {
      title: 'Prensa Francesa',
      img: '/images/tostado-moriah.webp',
      desc: 'Cuerpo redondo y notas achocolatadas. El ritual sin afán de las mañanas largas.',
    },
  ];
  return (
    <section className="tx-section tx-section--surface">
      <div className="tx-container">
        <div className="tx-section-head">
          <span className="tx-eyebrow">Un lugar para reunirse y conversar</span>
          <h2 className="tx-display tx-h2">Inspirados en nuestra tierra</h2>
        </div>
        <div className="tx-rituals">
          {rituals.map((r) => (
            <article className="tx-ritual" key={r.title}>
              <div className="tx-ritual__media">
                <img src={r.img} alt={r.title} width={600} height={450} loading="lazy" />
              </div>
              <h3 className="tx-display tx-h3">{r.title}</h3>
              <p className="tx-ritual__desc">{r.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ QUERIES ----------------------------- */
const HOME_PRODUCT_FIELDS = `#graphql
  fragment HomeProduct on Product {
    id
    title
    handle
    featuredImage {
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

const HOME_QUERY = `#graphql
  query Home($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    cafes: collection(handle: "cafes") {
      id
      products(first: 4) {
        nodes {
          ...HomeProduct
        }
      }
    }
    merch: collection(handle: "merch") {
      id
      products(first: 4) {
        nodes {
          ...HomeProduct
        }
      }
    }
  }
  ${HOME_PRODUCT_FIELDS}
`;

/** @typedef {import('./+types/_index').Route} Route */
