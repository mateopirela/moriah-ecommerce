import {useLoaderData, Link} from 'react-router';
import {ProductItem} from '~/components/ProductItem';
import {CafeCard} from '~/components/CafeCard';
import {BundleCard} from '~/components/BundleCard';
import {CAFES, SUBSCRIPTION} from '~/data/cafes';
import {
  IconArrowRight,
  IconTruck,
  IconShield,
  IconBox,
  IconClock,
  IconHeadset,
  IconLeaf,
  IconCheck,
  IconMountain,
  IconGift,
  StarRating,
} from '~/components/Icons';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [
    {title: 'MORIAH Café · Un café para el alma'},
    {
      name: 'description',
      content:
        'Café 100% colombiano de especialidad, tostado artesanal y sellado al vacío. Ediciones únicas con trazabilidad completa. Envío gratis desde $100.000.',
    },
    {property: 'og:title', content: 'MORIAH Café · Un café para el alma'},
    {property: 'og:type', content: 'website'},
    {
      property: 'og:description',
      content:
        'Café 100% colombiano de especialidad. En cada grano, una promesa.',
    },
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            name: 'MORIAH Café',
            slogan: 'Un café para el alma',
            description:
              'Café colombiano de especialidad, tostado artesanal y sellado al vacío.',
            foundingDate: '2025',
            areaServed: 'CO',
          },
          {
            '@type': 'WebSite',
            name: 'MORIAH Café',
            inLanguage: 'es',
            potentialAction: {
              '@type': 'SearchAction',
              target: '/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      },
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context}) {
  // Only show MORIAH's own cafés. Query the `cafes` collection; if it isn't
  // set up in Shopify yet, the homepage falls back to the local seed catalog.
  const {collection} = await context.storefront
    .query(HOME_CAFES_QUERY, {variables: {handle: 'cafes'}})
    .catch(() => ({collection: null}));

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    cafes: collection?.products?.nodes ?? null,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <Hero />
      <CafesSection cafes={data.cafes} />
      <ClubSection />
      <WhyMoriahSection />
      <ProcessSection />
      <ValueProps />
      <StorySection />
      <ShippingSection />
      <ReviewsSection />
      <NewsletterSection />
    </div>
  );
}

/* ------------------------------- HERO ------------------------------- */
function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
            Un tributo a la memoria
          </span>
          <h1 className="hero__title">
            Yo no aprendí a querer el café. <em>Lo heredé.</em>
          </h1>
          <p className="hero__sub">
            Cuando era niño, no entendía por qué ese olor detenía el tiempo. Salía de la cocina,
            llenaba la casa entera... y de repente, todos aparecían. Mi abuela, mis tíos, mi mamá.
            El tinto no era la excusa para reunirnos. Era la señal.
          </p>
          <Link className="btn btn--lg" to="/collections/cafes">
            Descubre tu café
            <IconArrowRight className="btn-icon" />
          </Link>
          <div className="stats" style={{width: '100%', marginTop: '1rem'}}>
            <Stat num="2025" label="Nace el propósito" />
            <Stat num="+5.000" label="Hogares alcanzados" />
            <Stat num="+10" label="Familias caficultoras" />
            <Stat num="100%" label="Origen colombiano" />
          </div>
        </div>
        <div className="hero__media">
          <img
            src="/images/hero-lifestyle.webp"
            alt="Bolsa de café MORIAH en la mano — Un café para el alma"
            width={1100}
            height={1375}
            fetchpriority="high"
            decoding="async"
          />
          <img
            className="hero__seal"
            src="/images/logo-moriah.png"
            alt=""
            width={120}
            height={120}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * @param {{num: string, label: string}}
 */
function Stat({num, label}) {
  return (
    <div className="stat">
      <div className="stat__num">{num}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}

/* ------------------------------ CAFÉS ------------------------------- */
/**
 * Shows ONLY the MORIAH cafés. Uses live Shopify products when the `cafes`
 * collection has items; otherwise falls back to the local seed catalog
 * (the 3 cafés from cafemoriah.com) so the store never shows demo products.
 * @param {{cafes: any[] | null}}
 */
function CafesSection({cafes}) {
  const hasShopify = cafes && cafes.length > 0;
  return (
    <section className="section section--cream" id="cafes">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">Selección premium</span>
          <h2 className="display-h2">Nuestros cafés</h2>
          <p className="lede" style={{textAlign: 'center'}}>
            Ediciones de especialidad y blends únicos, cultivados con intención
            y respeto por la tierra.
          </p>
        </div>

        {hasShopify ? (
          <div className="products-grid">
            {cafes.slice(0, 6).map((product, i) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={i < 3 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ) : (
          <TwoTierCatalog />
        )}

        <div style={{textAlign: 'center', marginTop: '3rem'}}>
          <Link className="btn btn--outline-gold btn--lg" to="/collections/cafes">
            Ver todos los cafés
            <IconArrowRight className="btn-icon" />
          </Link>
          <p className="muted" style={{marginTop: '1.25rem'}}>
            ¿No sabes cuál elegir?{' '}
            <Link className="link-arrow" to="/quiz">
              Haz el test de 3 preguntas
              <IconArrowRight width={16} height={16} />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/** Two-tier catalog (Pergamino-style price ladder) + launch bundle. */
function TwoTierCatalog() {
  const origen = CAFES.filter((c) => c.tier !== 'premium');
  const micro = CAFES.filter((c) => c.tier === 'premium');
  return (
    <>
      <div className="tier-head">
        <h3 className="display-h3">Línea de Origen</h3>
        <span className="muted">Para tu ritual diario</span>
      </div>
      <div className="products-grid">
        {origen.map((cafe, i) => (
          <CafeCard key={cafe.handle} cafe={cafe} loading={i < 2 ? 'eager' : 'lazy'} />
        ))}
        <BundleCard />
      </div>

      {micro.length > 0 && (
        <>
          <div className="tier-head">
            <h3 className="display-h3">Micro-lotes</h3>
            <span className="muted">Ediciones limitadas para ocasiones especiales</span>
          </div>
          <div className="products-grid">
            {micro.map((cafe) => (
              <CafeCard key={cafe.handle} cafe={cafe} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

/** Club de la Memoria — subscription as recurring ritual and community. */
function ClubSection() {
  return (
    <section className="section section--dark" id="club">
      <div className="container club">
        <div className="club__body">
          <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
            Club de la Memoria
          </span>
          <h2 className="display-h2">La pausa que mereces. Cada mes.</h2>
          <p className="lede" style={{color: 'rgba(247,243,234,0.8)'}}>
            Suscríbete y devuélvete el tiempo que importa. Un café de especialidad a tu puerta
            en la frecuencia que elijas, con sorpresas cada mes y un 15% de descuento para siempre.
          </p>
          <ul className="club__perks">
            {SUBSCRIPTION.perks.map((p) => (
              <li key={p}>
                <IconCheck width={18} height={18} />
                {p}
              </li>
            ))}
          </ul>
          <Link className="btn btn--lg" to="/collections/cafes">
            Elegir mi café
            <IconArrowRight className="btn-icon" />
          </Link>
          <p className="muted" style={{color: 'rgba(247,243,234,0.6)', fontSize: '0.85rem'}}>
            Frecuencias: {SUBSCRIPTION.frequencies.join(' · ')}
          </p>
        </div>
        <div className="club__card">
          <IconGift style={{width: 40, height: 40, color: 'var(--gold-400)'}} />
          <p className="display-h3" style={{color: 'var(--cream-50)'}}>
            Regalo en tu primer pedido
          </p>
          <p className="muted" style={{color: 'rgba(247,243,234,0.7)'}}>
            Al unirte al Club Moriah, tu primera entrega llega con una sorpresa
            de la casa.
          </p>
          <p className="club__discount">−15%</p>
          <p className="muted" style={{color: 'rgba(247,243,234,0.7)'}}>
            en cada entrega, para siempre
          </p>
        </div>
      </div>
    </section>
  );
}

/** "¿Por qué Moriah?" — the name as story (Pergamino-style). */
function WhyMoriahSection() {
  return (
    <section className="section section--cream" id="por-que-moriah">
      <div className="container why">
        <div className="why__icon">
          <IconMountain style={{width: 48, height: 48, color: 'var(--primary)'}} />
        </div>
        <span className="eyebrow">¿Por qué Moriah?</span>
        <h2 className="display-h2">Moriah, el monte de la provisión</h2>
        <p className="lede" style={{textAlign: 'center'}}>
          Moriah es el monte donde, en la historia, se reveló la provisión: lo
          esencial llega cuando más se necesita. Ese es nuestro propósito —que
          cada taza sea un recordatorio de conexión, propósito y vida. En cada
          grano, una promesa. En cada taza, provisión.
        </p>
        <Link className="link-arrow" to="/pages/nuestra-historia">
          Conoce nuestra historia
          <IconArrowRight width={16} height={16} />
        </Link>
      </div>
    </section>
  );
}

/* ----------------------------- PROCESO ------------------------------ */
function ProcessSection() {
  const steps = [
    {
      n: '01',
      t: 'Cultivo selectivo',
      d: 'Cada grano es elegido de las mejores fincas colombianas, cultivadas en alturas que desarrollan perfiles de sabor únicos.',
    },
    {
      n: '02',
      t: 'Tostado artesanal',
      d: 'Nuestros maestros tostadores conducen un proceso preciso para resaltar la esencia de cada origen, lote a lote.',
    },
    {
      n: '03',
      t: 'Empaque premium',
      d: 'Cada bolsa es sellada al vacío para preservar frescura, aroma y sabor. Una promesa de calidad en tus manos.',
    },
  ];
  return (
    <section className="section" id="proceso">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Cómo lo hacemos</span>
          <h2 className="display-h2">Nuestro proceso</h2>
        </div>
        <div className="process">
          {steps.map((s) => (
            <div className="process-step" key={s.n}>
              <span className="process-step__num">{s.n}</span>
              <h3 className="process-step__title">{s.t}</h3>
              <p className="process-step__text">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- VALUE PROPS ---------------------------- */
function ValueProps() {
  const props = [
    {Icon: IconTruck, t: 'Envío a todo Colombia', d: '2–4 días hábiles'},
    {Icon: IconBox, t: 'Sellado al vacío', d: 'Frescura garantizada'},
    {Icon: IconShield, t: 'Compra segura', d: 'Pago protegido'},
    {Icon: IconLeaf, t: 'Trazabilidad total', d: 'Sabes de dónde viene'},
  ];
  return (
    <section className="section--tight section--cream">
      <div className="container valueprops">
        {props.map(({Icon, t, d}) => (
          <div className="valueprop" key={t}>
            <Icon className="valueprop__icon" />
            <div>
              <div className="valueprop__title">{t}</div>
              <div className="valueprop__text">{d}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- HISTORIA ----------------------------- */
function StorySection() {
  return (
    <section className="section">
      <div className="container story">
        <div className="story__media">
          <img
            src="/images/lineup-bolsas.webp"
            alt="Línea de empaques MORIAH Café"
            width={1024}
            height={1280}
            loading="lazy"
          />
        </div>
        <div className="story__body">
          <span className="eyebrow">Más que café</span>
          <h2 className="display-h2">Un propósito compartido</h2>
          <p className="lede">
            Somos un grupo de amigos unidos por un sueño: servir al mundo a
            través del café colombiano de especialidad. Seleccionamos los
            mejores granos y perfeccionamos cada proceso desde 2025.
          </p>
          <blockquote className="quote">
            “Cada grano que llega a tus manos cuenta una historia de origen,
            dedicación y conexión.”
          </blockquote>
          <Link className="link-arrow" to="/pages/nuestra-historia">
            Conoce nuestra historia
            <IconArrowRight width={16} height={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- ENVÍOS ------------------------------- */
function ShippingSection() {
  const items = [
    {Icon: IconTruck, t: 'Envío rápido', a: '2–4 días hábiles', b: 'A todo el país'},
    {Icon: IconBox, t: 'Empaque premium', a: 'Sellado al vacío', b: 'Frescura garantizada'},
    {Icon: IconShield, t: 'Envío seguro', a: 'Rastreo en tiempo real', b: 'Producto protegido'},
    {Icon: IconCheck, t: 'Envío gratis', a: 'En compras desde', b: '$100.000'},
    {Icon: IconClock, t: 'Pedidos express', a: 'Ciudades principales', b: '24–48 horas'},
    {Icon: IconHeadset, t: 'Soporte 24/7', a: 'Atención al cliente', b: 'Siempre disponible'},
  ];
  return (
    <section className="section section--dark" id="envios">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
            Envíos a todo Colombia
          </span>
          <h2 className="display-h2">Tu café premium, fresco a tu puerta</h2>
        </div>
        <div className="shipping-grid">
          {items.map(({Icon, t, a, b}) => (
            <div className="card-dark" key={t}>
              <Icon style={{width: 30, height: 30, color: 'var(--gold-400)'}} />
              <h3 className="display-h3" style={{marginTop: '1rem', fontSize: '1.2rem'}}>
                {t}
              </h3>
              <p style={{color: 'var(--gold-300)', fontWeight: 600}}>{a}</p>
              <p className="muted" style={{color: 'rgba(247,243,234,0.65)'}}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- RESEÑAS ------------------------------ */
function ReviewsSection() {
  const reviews = [
    {
      r: 5,
      body: 'El mejor café que he probado en casa. El aroma desde que abres la bolsa es otra cosa. Se nota el tostado artesanal.',
      author: 'Laura M. · Bogotá',
    },
    {
      r: 5,
      body: 'Pedí el Geisha y llegó en dos días, sellado al vacío y fresquísimo. La experiencia completa se siente premium.',
      author: 'Andrés R. · Medellín',
    },
    {
      r: 5,
      body: 'Más que un café, una historia. Me encanta saber de qué finca viene. Volví a comprar el Bourbon Rosado.',
      author: 'Valentina G. · Cali',
    },
  ];
  return (
    <section className="section section--cream">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">Lo que dicen</span>
          <h2 className="display-h2">Amado en miles de hogares</h2>
          <StarRating rating={5} count={undefined} />
        </div>
        <div className="reviews">
          {reviews.map((rev) => (
            <div className="review-card" key={rev.author}>
              <span className="review-card__stars" aria-hidden="true">
                <StarRating rating={rev.r} />
              </span>
              <p className="review-card__body">“{rev.body}”</p>
              <p className="review-card__author">{rev.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- NEWSLETTER ----------------------------- */
function NewsletterSection() {
  return (
    <section className="section section--pine">
      <div className="container newsletter">
        <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
          Únete a la comunidad
        </span>
        <h2 className="display-h2">10% en tu primera compra</h2>
        <p className="lede" style={{textAlign: 'center', color: 'rgba(247,243,234,0.78)'}}>
          Suscríbete y recibe novedades, ediciones limitadas y rituales de café.
        </p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            name="email"
            required
            placeholder="Tu correo electrónico"
            aria-label="Correo electrónico"
          />
          <button className="btn" type="submit">
            Suscribirme
            <IconArrowRight className="btn-icon" />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ------------------------------ QUERIES ----------------------------- */
const HOME_PRODUCT_FRAGMENT = `#graphql
  fragment HomeProduct on Product {
    id
    title
    handle
    vendor
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
`;

const HOME_CAFES_QUERY = `#graphql
  ${HOME_PRODUCT_FRAGMENT}
  query HomeCafes($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      products(first: 6, sortKey: PRICE) {
        nodes {
          ...HomeProduct
        }
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
