import {useEffect, useRef, useState} from 'react';
import {Link, useFetcher} from 'react-router';
import {BUNDLE, CAFES, bundlePrice, formatCop, getCafe, subscriptionPrice} from '~/data/cafes';
import {MERCH} from '~/data/merch';
import {PromesasStrip} from '~/components/PromesasStrip';
import {useReveal} from '~/lib/useReveal';
import {Testimonials} from '~/components/Testimonials';
import {BlogSection} from '~/components/BlogSection';
import {OrigenSection} from '~/components/OrigenSection';
import {PrimeraVez} from '~/components/PrimeraVez';
import {seoMeta} from '~/lib/seo';
import {siteUrl} from '~/lib/env.server';

/** @type {Route.MetaFunction} */
export const meta = ({data}) =>
  seoMeta({
    origin: data?.origin ?? '',
    path: '/',
    title: 'MORIAH Café · Un café para el alma',
    description:
      'Café de especialidad de las montañas de Colombia, para volver a la pausa de cada mañana. Microlotes de Pitalito, Huila, en grano o molido. Entrega en 2–5 días.',
  });

/** Precarga el póster del hero: es lo primero que se ve mientras llega el video. */
export function links() {
  return [{rel: 'preload', as: 'image', href: '/images/hero-poster.webp', fetchpriority: 'high'}];
}

/** El home se sirve del catálogo local (sin llamadas externas). */
export function loader({request}) {
  return {cafes: CAFES, origin: siteUrl(request)};
}

/** Pon `true` cuando el merch (caja, pocillo, tote, gorra) esté listo para vender. */
const SHOW_INFALTABLES = false;

export default function Homepage() {
  useReveal();
  return (
    <div className="tx">
      <BannerHome />
      <PromesasStrip />
      <LineasSection />
      {SHOW_INFALTABLES ? <InfaltablesSection /> : null}
      <PrimeraVez />
      <OrigenSection />
      <Testimonials />
      <BlogSection />
      <NewsletterSection />
    </div>
  );
}

/* ============================================================
   BANNER HOME — video full-width con texto (Tropicalia)
   ============================================================ */
/** Bolsa que se ve en el hero mientras no se apunta a ningún café. */
const HERO_DEFAULT_BAG = '/images/cafe-bolsa-pacamara-front.webp';

function BannerHome() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);
  const [focused, setFocused] = useState(null);
  const [swapped, setSwapped] = useState(false);

  const userPaused = useRef(false);

  // El video es decorativo, mudo y de 2 MB: se reproduce siempre (también con
  // "reducir movimiento" del sistema). Para cumplir accesibilidad hay un botón
  // visible de pausa/reproducir. Solo se frena con "ahorro de datos".
  // Los navegadores pausan los videos automáticos cuando la pestaña no se ve:
  // se reanudan solos al volver, salvo que la persona los haya pausado.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const saveData = navigator.connection?.saveData === true;
    if (saveData) userPaused.current = true;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    // El video aparece con un fundido cuando ya tiene imagen. Si empezó antes de que
    // React cargara (readyState ya alto), también se muestra: nunca queda oculto.
    const onReady = () => setReady(true);
    if (video.readyState >= 2) setReady(true);
    video.addEventListener('loadeddata', onReady);
    video.addEventListener('playing', onReady);
    const resume = () => {
      if (!userPaused.current && video.paused && document.visibilityState === 'visible') {
        video.play().catch(() => {});
      }
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    document.addEventListener('visibilitychange', resume);
    window.addEventListener('focus', resume);

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => entry.isIntersecting && resume(), {
            threshold: 0.25,
          })
        : null;
    observer?.observe(video);

    if (saveData) video.pause();
    else resume();

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('playing', onReady);
      document.removeEventListener('visibilitychange', resume);
      window.removeEventListener('focus', resume);
      observer?.disconnect();
    };
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const cafes = CAFES.slice(0, 3);
  // La bolsa grande cambia al apuntar (mouse o teclado) a un café con `heroImage`.
  const bag = cafes.find((c) => c.handle === focused)?.heroImage ?? HERO_DEFAULT_BAG;

  return (
    <section className="tx-banner tx-banner--split">
      <div className="tx-banner__inner">
        <div className="tx-banner__texto">
          <span className="tx-banner__eyebrow">Café de especialidad</span>
          <h1 className="tx-display tx-banner__h1">
            Yo no aprendí a querer el café. <em>Lo heredé.</em>
          </h1>
          <p className="tx-banner__sub">
            Café de especialidad de las montañas de Colombia, para volver a la pausa de cada mañana.
          </p>
          <div className="tx-banner__acciones">
            <Link className="tx-btn" to="/collections/cafes">
              Comprar café
            </Link>
            <Link className="tx-btn tx-btn--fantasma" to="/quiz">
              Encuentra tu café
            </Link>
          </div>
        </div>
        <div className="tx-banner__producto" aria-hidden="true">
          <img
            key={bag}
            className={swapped ? 'is-swap' : undefined}
            src={bag}
            alt=""
            width={637}
            height={975}
            // React 18 aún no acepta `fetchPriority` en <img>: va en minúscula.
            // eslint-disable-next-line react/no-unknown-property
            fetchpriority="high"
          />
        </div>
        <button
          type="button"
          className="tx-banner__playpause"
          onClick={toggleVideo}
          aria-label={playing ? 'Pausar video de fondo' : 'Reproducir video de fondo'}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <nav className="tx-banner__cafes" aria-label="Cafés destacados">
        {cafes.map((c) => (
          <Link
            className="tx-banner__cafe"
            to={`/products/${c.handle}`}
            key={c.handle}
            onMouseEnter={() => {
              setSwapped(true);
              setFocused(c.handle);
            }}
            onMouseLeave={() => setFocused(null)}
            onFocus={() => {
              setSwapped(true);
              setFocused(c.handle);
            }}
            onBlur={() => setFocused(null)}
          >
            <span className="tx-banner__cafe-tier">{c.tierLabel}</span>
            <span className="tx-banner__cafe-name">{c.title}</span>
            <span className="tx-banner__cafe-price">{formatCop(c.price)}</span>
          </Link>
        ))}
      </nav>
      {/* 720p · 10 s · 2 MB (antes: 1080p, 14 s, 7,4 MB con preload="auto").
          Con ahorro de datos se queda en el póster. */}
      <video
        ref={videoRef}
        className={`tx-banner__video${ready ? ' is-ready' : ''}`}
        poster="/images/hero-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/videos/cafe.mp4" type="video/mp4" />
      </video>
    </section>
  );
}

/* ============================================================
   LÍNEAS — 4 formas de comprar (Tropicalia: #lineas)
   Los precios salen del catálogo (app/data/cafes.js): al cambiarlos allí,
   esta sección se actualiza sola.
   ============================================================ */
const PRECIO_DESDE = Math.min(...CAFES.map((c) => c.price));
const KIT_PRECIO = bundlePrice();
const KIT_SUMA = BUNDLE.includes.reduce((acc, h) => acc + (getCafe(h)?.price ?? 0), 0);

/** Café de la casa: aún no está en el catálogo, por eso va aparte (enlaza a todos los cafés). */
const CASA = {
  handle: 'casa',
  title: 'De la casa',
  notas: 'Chocolate, panela y nuez',
  img: '/images/cafe-casa-blend.webp',
  // Foto de la bolsa sobre granos (no es un recorte): se muestra a pleno panel.
  foto: true,
  to: '/collections/cafes',
  precio: 42990,
};

const CARDS_CAFE = [
  {
    key: CASA.handle,
    title: CASA.title,
    notas: CASA.notas,
    img: CASA.img,
    foto: CASA.foto,
    to: CASA.to,
    precio: CASA.precio,
    chip: 'El de siempre',
  },
  ...CAFES.map((c) => ({
    key: c.handle,
    title: c.title,
    notas: c.flavor ?? c.notes,
    img: c.heroImage ?? c.image,
    to: `/products/${c.handle}`,
    precio: c.price,
    tono: c.tono,
    club: true,
    // Recorte sin fondo: el arco aporta el color.
    recorte: true,
  })),
];

function CafeTile({c}) {
  return (
    <article className="tx-cafe" data-reveal-child>
      <Link
        className={`tx-cafe__media${c.foto ? ' tx-cafe__media--foto' : ''}`}
        style={c.tono ? {'--tono': c.tono} : undefined}
        to={c.to}
        tabIndex={-1}
        aria-hidden="true"
      >
        {c.chip ? <span className="tx-linea__chip">{c.chip}</span> : null}
        <img src={c.img} alt="" width={400} height={480} loading="lazy" />
      </Link>
      <h3 className="tx-cafe__name">
        <Link to={c.to}>{c.title}</Link>
      </h3>
      <p className="tx-cafe__precio">{formatCop(c.precio)}</p>
      {c.club ? (
        <p className="tx-club-tag">
          Club −15 %: {formatCop(subscriptionPrice(c.precio))} por entrega
        </p>
      ) : null}
      <p className="tx-cafe__notas">{c.notas}</p>
      <Link className="tx-btn tx-btn--peq" to={c.to} aria-label={`Ver café ${c.title}`}>
        Ver café
      </Link>
    </article>
  );
}

function OfertaCard({img, imgAlt, eyebrow, title, texto, precio, tachado, cta, to, chip}) {
  return (
    <article className="tx-oferta" data-reveal-child>
      <Link className="tx-oferta__media" to={to} tabIndex={-1} aria-hidden="true">
        <img src={img} alt={imgAlt} width={400} height={300} loading="lazy" />
      </Link>
      <div className="tx-oferta__cuerpo">
        <span className="tx-linea__eyebrow">
          {eyebrow} {chip ? <b className="tx-oferta__chip">{chip}</b> : null}
        </span>
        <h3 className="tx-oferta__titulo">
          <Link to={to}>{title}</Link>
        </h3>
        <p className="tx-oferta__texto">{texto}</p>
        <p className="tx-oferta__precio">
          <strong>{precio}</strong>
          {tachado ? <s>{tachado}</s> : null}
        </p>
        <Link className="tx-btn tx-btn--peq" to={to} aria-label={`${cta}: ${title}`}>
          {cta}
        </Link>
      </div>
    </article>
  );
}

function LineasSection() {
  const gridRef = useRef(null);
  const mover = (dir) => {
    const el = gridRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({left: dir * el.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth'});
  };
  return (
    <section className="tx-section tx-lineas-section" id="lineas">
      <div className="tx-container">
        <div className="tx-lineas-head" data-reveal>
          <div className="tx-titulo-eyebrow">Ahora puedes tener</div>
          <h2 className="tx-display tx-h2">
            La riqueza de nuestra tierra<br /> en tus manos
          </h2>
        </div>

        <h3 className="tx-lineas-grupo__t">Elige tu café</h3>
        <div className="tx-lineas-hint">
          <span aria-hidden="true">Desliza para ver más →</span>
          <span className="tx-lineas-nav">
            <button type="button" onClick={() => mover(-1)} aria-label="Ver cafés anteriores">
              ←
            </button>
            <button type="button" onClick={() => mover(1)} aria-label="Ver más cafés">
              →
            </button>
          </span>
        </div>
        <div
          className="tx-cafes"
          data-reveal
          ref={gridRef}
          role="region"
          aria-label="Nuestros cafés"
          // Región desplazable: debe poder enfocarse para recorrerla con el teclado.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          {CARDS_CAFE.map((c) => (
            <CafeTile c={c} key={c.key} />
          ))}
        </div>

        <h3 className="tx-lineas-grupo__t">Ahorra 15 %</h3>
        <div className="tx-ofertas" data-reveal>
          <OfertaCard
            img="/images/kit-tres-origenes-cut.webp"
            imgAlt="Kit con las bolsas de Pacamara, Bourbon Rosado y Tabi"
            eyebrow="Kit tres variedades"
            chip="−15 %"
            title="Pacamara, Bourbon Rosado y Tabi"
            texto="Pruébalos lado a lado o regálalos."
            precio={formatCop(KIT_PRECIO)}
            tachado={formatCop(KIT_SUMA)}
            cta="Armar mi kit"
            to="/products/kit-tres-origenes"
          />
          <OfertaCard
            img="/images/cafe-bolsa-tabi-front.webp"
            imgAlt="Bolsa de café Moriah"
            eyebrow="Club de la Memoria"
            chip="−15 % siempre"
            title="Tu café, siempre en casa"
            texto="Elige cada 2, 4 o 6 semanas. Pausa cuando quieras."
            precio={`Desde ${formatCop(subscriptionPrice(PRECIO_DESDE))} por entrega`}
            cta="Suscribirme"
            to="/suscripcion"
          />
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
              to={`/products/${m.handle}`}
              key={m.handle}
              prefetch="intent"
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
