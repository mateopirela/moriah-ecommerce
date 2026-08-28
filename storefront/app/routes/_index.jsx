import {Link, useFetcher} from 'react-router';
import {CAFES, formatCop} from '~/data/cafes';
import {MERCH} from '~/data/merch';
import {Marquee} from '~/components/Marquee';
import {useReveal} from '~/lib/useReveal';
import {
  IconTruck,
  IconLeaf,
  IconShield,
  IconClock,
  StarRating,
} from '~/components/Icons';

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

/** El home se sirve del catálogo local (sin llamadas externas). */
export function loader() {
  return {cafes: CAFES};
}

export default function Homepage() {
  useReveal();
  return (
    <div className="tx">
      <BannerHome />
      <Marquee />
      <LineasSection />
      <InfaltablesSection />
      <ValuePropsSection />
      <GaleriaSection />
      <TestimoniosSection />
      <NewsletterSection />
    </div>
  );
}

/* ============================================================
   BANNER HOME — video full-width con texto (Tropicalia)
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
      <video
        className="tx-banner__video"
        src="/videos/cafe.mp4"
        poster="/images/tostado-moriah.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="MORIAH Café — Un café para el alma"
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
    img: '/images/producto-bolsa-cut.png',
    to: '/collections/cafes',
    mod: 'origen',
  },
  {
    key: 'microlotes',
    name: 'Micro-lotes',
    subtitle: 'Cafés sublimes',
    desc: 'Un privilegio reservado para los verdaderos amantes del café. Nano-lotes y varietales extraordinarios, de sabores inolvidables. Aquí encontrarás una selección de genética pura y cafés de competición.',
    img: '/images/cafe-bolsa-cut.png',
    to: '/collections/cafes',
    mod: 'micro',
  },
  {
    key: 'club',
    name: 'Club de la Memoria',
    subtitle: 'Tu café, siempre fresco',
    desc: 'Devuélvete el tiempo que importa. Recibe tu café en la frecuencia que elijas, con 15% de descuento permanente. Tostado fresco, sellado al vacío, directo a tu puerta. Sin complicaciones.',
    img: '/images/producto-bolsa-cut.png',
    to: '/#club',
    mod: 'club',
  },
  {
    key: 'legado',
    name: 'Kit El Legado',
    subtitle: 'El ritual completo',
    desc: 'Molino, pocillo y café: la herramienta para heredar una tradición. Todo lo que necesitas para preparar el mejor café en casa y compartir el ritual con quienes más quieres.',
    img: '/images/kit-bolsas-cut.png',
    to: '/collections/cafes',
    mod: 'legado',
  },
];

function LineasSection() {
  return (
    <section className="tx-section tx-lineas-section" id="lineas">
      <div className="tx-container">
        <div className="tx-lineas-head" data-reveal>
          <div className="tx-titulo-eyebrow">Ahora puedes tener</div>
          <h2 className="tx-display tx-h2">
            La riqueza de nuestra tierra<br /> en tus manos
          </h2>
        </div>
        <div className="tx-lineas-grid" data-reveal>
          {LINEAS.map((l) => (
            <article className="tx-linea" data-reveal-child key={l.key}>
              <div className="tx-linea__media">
                <img
                  src={l.img}
                  alt={l.name}
                  width={400}
                  height={480}
                  loading="lazy"
                  className="tx-linea__img"
                />
              </div>
              <div className="tx-linea__contenido">
                <div className="tx-linea__nombres">
                  <h3 className="tx-linea__name">{l.name}</h3>
                  <span className="tx-linea__sub">{l.subtitle}</span>
                </div>
                <p className="tx-lede tx-linea__desc">{l.desc}</p>
                <Link className="tx-btn tx-btn--peq" to={l.to}>
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

/* ============================================================
   NUESTROS INFALTABLES (Tropicalia: productos)
   ============================================================ */
function InfaltablesSection() {
  const featured = MERCH.slice(0, 4);
  return (
    <section className="tx-section tx-infaltables-section">
      <div className="tx-container">
        <div className="tx-infaltables-head" data-reveal>
          <h2 className="tx-display tx-h2">Nuestros infaltables</h2>
          <Link
            className="tx-btn tx-btn--ink tx-desktop-only"
            to="/collections/all"
          >
            Ver todos
          </Link>
        </div>
        <div className="tx-products" data-reveal>
          {featured.map((m) => (
            <Link
              className="tx-product-card"
              data-reveal-child
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
   VALUE PROPS — franja de confianza (SVG, sin emojis)
   ============================================================ */
const VALUE_PROPS = [
  {
    icon: IconTruck,
    title: 'Envío gratis',
    desc: 'En compras desde $100.000, a todo el país',
  },
  {
    icon: IconLeaf,
    title: 'Tostado fresco',
    desc: 'Tostamos cada semana, sellado al vacío',
  },
  {
    icon: IconShield,
    title: 'Pago seguro',
    desc: 'Nequi, PSE y tarjetas, sin complicaciones',
  },
  {
    icon: IconClock,
    title: 'Entrega 2–4 días',
    desc: 'Bogotá 2–3 días · Nacional 3–5 días',
  },
];

function ValuePropsSection() {
  return (
    <section className="tx-valueprops" aria-label="Nuestras garantías">
      <div className="tx-container tx-valueprops__grid" data-reveal>
        {VALUE_PROPS.map((vp) => (
          <div className="tx-valueprop" data-reveal-child key={vp.title}>
            <vp.icon width={26} height={26} aria-hidden="true" />
            <div>
              <p className="tx-valueprop__title">{vp.title}</p>
              <p className="tx-valueprop__desc">{vp.desc}</p>
            </div>
          </div>
        ))}
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
        <div className="tx-galeria-split__fotos" data-reveal>
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
        <div className="tx-galeria-split__body tx-container" data-reveal>
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
   TESTIMONIOS — voces de la comunidad
   ============================================================ */
const TESTIMONIOS = [
  {
    quote:
      'Aroma increíble apenas abres la bolsa. Se nota el tostado artesanal y la frescura del sellado al vacío.',
    name: 'Laura M.',
    city: 'Bogotá',
  },
  {
    quote:
      'Llegó en dos días, impecable. La experiencia completa se siente premium, volveré a pedir.',
    name: 'Andrés R.',
    city: 'Medellín',
  },
  {
    quote:
      'Saber de qué finca viene hace la diferencia. Un café con propósito y con sabor.',
    name: 'Valentina G.',
    city: 'Cali',
  },
];

function TestimoniosSection() {
  return (
    <section className="tx-section tx-testimonios">
      <div className="tx-container">
        <div className="tx-testimonios__head" data-reveal>
          <span className="tx-eyebrow">Voces de nuestra comunidad</span>
          <h2 className="tx-display tx-h2">Un café que se comparte</h2>
        </div>
        <div className="tx-testimonios__grid" data-reveal>
          {TESTIMONIOS.map((t) => (
            <figure className="tx-testimonio" data-reveal-child key={t.name}>
              <StarRating rating={5} />
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                {t.name} · <span>{t.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   NEWSLETTER — Club de la Memoria (captura de email)
   ============================================================ */
function NewsletterSection() {
  const fetcher = useFetcher();
  const sent = fetcher.data?.ok === true;

  return (
    <section className="tx-newsletter" id="club">
      <div className="tx-container tx-newsletter__inner" data-reveal>
        <span className="tx-eyebrow">Club de la Memoria</span>
        <h2 className="tx-display tx-h2 tx-newsletter__title">
          Tu primer café, con <em>10% de regalo</em>
        </h2>
        <p className="tx-newsletter__lede">
          Únete y recibe historias de origen, lanzamientos de micro-lotes y un
          10% de descuento en tu primer pedido.
        </p>
        {sent ? (
          <p className="tx-newsletter__ok" role="status">
            ¡Listo! Tu código es <strong>MIPRIMERTINTO10</strong>: úsalo en el carrito.
          </p>
        ) : (
          <fetcher.Form method="post" action="/api/newsletter" className="tx-newsletter__form">
            <label htmlFor="newsletter-email" className="sr-only">
              Tu correo electrónico
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              placeholder="tu@correo.com"
              autoComplete="email"
            />
            <button type="submit" className="tx-btn">
              Quiero mi 10%
            </button>
          </fetcher.Form>
        )}
      </div>
    </section>
  );
}

/** @typedef {import('./+types/_index').Route} Route */
