import {Link} from 'react-router';
import {formatCop} from '~/data/cafes';
import {MERCH} from '~/data/merch';

/** @type {Route.MetaFunction} */
export const meta = () => [
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

/** @param {Route.LoaderArgs} args */
export async function loader(args) {
  const {collection} = await args.context.storefront
    .query(HOME_CAFES_QUERY, {variables: {handle: 'cafes'}})
    .catch(() => ({collection: null}));
  return {cafes: collection?.products?.nodes ?? null};
}

export default function Homepage() {
  return (
    <div className="tx">
      <BannerHome />
      <LineasSection />
      <VideoSection />
      <InfaltablesSection />
      <GaleriaSection />
    </div>
  );
}

/* ============================================================
   BANNER HOME — imagen full-width con texto (Tropicalia)
   ============================================================ */
function BannerHome() {
  return (
    <section className="tx-banner">
      <div className="tx-banner__texto">
        <h1 className="tx-display tx-banner__h1">
          Yo no aprendí a querer el café. <em>Lo heredé.</em>
        </h1>
        <a className="tx-btn" href="#lineas">
          Conoce más
        </a>
      </div>
      <img
        src="/images/hero-lifestyle.webp"
        alt="MORIAH Café — Un café para el alma"
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="tx-banner__img"
      />
    </section>
  );
}

/* ============================================================
   LÍNEAS — 4 líneas de café (Tropicalia: #lineas)
   ============================================================ */
const LINEAS = [
  {
    key: 'origen',
    name: 'Línea de Origen',
    subtitle: 'Cafés con propósito',
    desc: 'Dedicados a los auténticos exploradores, aquellos que encuentran valor en las pequeñas cosas que otorgan sentido a la vida. Cafés 100% colombianos de alta montaña, cultivados con intención y respeto por la tierra.',
    img: '/images/cafe-bolsa.webp',
    to: '/collections/cafes',
    mod: 'origen',
  },
  {
    key: 'microlotes',
    name: 'Micro-lotes',
    subtitle: 'Cafés sublimes',
    desc: 'Un privilegio reservado para los verdaderos amantes del café. Nano-lotes y varietales extraordinarios, de sabores inolvidables. Aquí encontrarás una selección de genética pura y cafés de competición.',
    img: '/images/producto-bolsa.webp',
    to: '/collections/cafes',
    mod: 'micro',
  },
  {
    key: 'club',
    name: 'Club de la Memoria',
    subtitle: 'Tu café, siempre fresco',
    desc: 'Devuélvete el tiempo que importa. Recibe tu café en la frecuencia que elijas, con 15% de descuento permanente. Tostado fresco, sellado al vacío, directo a tu puerta. Sin complicaciones.',
    img: '/images/lineup-bolsas.webp',
    to: '/#club',
    mod: 'club',
  },
  {
    key: 'legado',
    name: 'Kit El Legado',
    subtitle: 'El ritual completo',
    desc: 'Molino, pocillo y café: la herramienta para heredar una tradición. Todo lo que necesitas para preparar el mejor café en casa y compartir el ritual con quienes más quieres.',
    img: '/images/kit-bolsas.webp',
    to: '/collections/cafes',
    mod: 'legado',
  },
];

function LineasSection() {
  return (
    <section className="tx-section tx-lineas-section" id="lineas">
      <div className="tx-container">
        <div className="tx-lineas-head">
          <div className="tx-titulo-eyebrow">Ahora puedes tener</div>
          <h2 className="tx-display tx-h2">
            La riqueza de nuestra tierra en tus manos
          </h2>
        </div>
        <div className="tx-lineas-grid">
          {LINEAS.map((l) => (
            <div className="tx-linea" key={l.key}>
              <div className={`tx-linea__header tx-linea__header--${l.mod}`}>
                <div className="tx-linea__nombres">
                  <span className="tx-linea__name">{l.name}</span>
                  <span className="tx-linea__sub">{l.subtitle}</span>
                </div>
              </div>
              <div className="tx-linea__body">
                <div className="tx-linea__contenido">
                  <p className="tx-lede tx-linea__desc">{l.desc}</p>
                  <Link className="tx-btn tx-btn--peq" to={l.to}>
                    Comprar ahora
                  </Link>
                </div>
                <img
                  src={l.img}
                  alt={l.name}
                  width={400}
                  height={480}
                  loading="lazy"
                  className="tx-linea__img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   VIDEO / DARK SECTION — fondo oscuro con texto (Tropicalia)
   ============================================================ */
function VideoSection() {
  return (
    <section className="tx-dark-section">
      <img
        src="/images/monte-moriah.webp"
        alt="Monte Moriah — Café de especialidad"
        className="tx-dark-section__bg"
        width={1920}
        height={1080}
        loading="lazy"
      />
      <div className="tx-dark-section__overlay">
        <h2 className="tx-display tx-h2 tx-dark-section__texto">
          Cada grano lo seleccionamos cuidadosamente para llevarte los mejores
          cafés especiales de Colombia
        </h2>
      </div>
    </section>
  );
}

/* ============================================================
   NUESTROS INFALTABLES (Tropicalia: productos)
   ============================================================ */
function InfaltablesSection() {
  const featured = MERCH.slice(0, 4);
  return (
    <section className="tx-section tx-infaltables-section">
      <div className="tx-container">
        <div className="tx-infaltables-head">
          <h2 className="tx-display tx-h2">Nuestros infaltables</h2>
          <Link
            className="tx-btn tx-btn--ink tx-desktop-only"
            to="/collections/all"
          >
            Ver todos
          </Link>
        </div>
        <div className="tx-products">
          {featured.map((m) => (
            <Link
              className="tx-product-card"
              to="/collections/cafes"
              key={m.handle}
            >
              <div className="tx-product-card__media">
                {m.badge && (
                  <span className="tx-product-card__badge">{m.badge}</span>
                )}
                <img
                  src={m.image}
                  alt={m.title}
                  width={500}
                  height={500}
                  loading="lazy"
                />
              </div>
              <span className="tx-product-card__name">{m.title}</span>
              <span className="tx-product-card__price">
                {formatCop(m.price)}
              </span>
            </Link>
          ))}
        </div>
        <div className="tx-infaltables-movil">
          <Link className="tx-btn tx-btn--ink" to="/collections/all">
            Ver todos
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GALERÍA / INSPIRADOS (Tropicalia: tienda)
   ============================================================ */
const FOTOS = [
  '/images/monte-moriah.webp',
  '/images/tostado-moriah.webp',
  '/images/equipo-moriah.webp',
  '/images/cafe-cafes.webp',
  '/images/lineup-bolsas.webp',
  '/images/hero-lifestyle.webp',
];

function GaleriaSection() {
  return (
    <section className="tx-section tx-galeria-section">
      <aside className="tx-galeria-split">
        <div className="tx-galeria-split__fotos">
          <div className="tx-gallery">
            {FOTOS.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`MORIAH Café ${i + 1}`}
                width={400}
                height={533}
                loading="lazy"
              />
            ))}
          </div>
        </div>
        <div className="tx-galeria-split__body tx-container">
          <span className="tx-eyebrow">Un lugar para reunirse y conversar</span>
          <h2 className="tx-display tx-h2">
            Inspirados en nuestra tierra
          </h2>
          <p className="tx-lede">
            Un privilegio colombiano, hecho con intención y respeto. En cada
            taza, la historia de una tierra que da lo mejor de sí. En cada
            ritual, un momento para volver a lo que importa.
          </p>
          <Link className="tx-btn" to="/collections/cafes">
            Comprar ahora
          </Link>
        </div>
      </aside>
    </section>
  );
}

/* ============================================================
   GRAPHQL
   ============================================================ */
const HOME_CAFES_QUERY = `#graphql
  query HomeCafes($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      products(first: 6, sortKey: PRICE) {
        nodes { id title handle }
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
