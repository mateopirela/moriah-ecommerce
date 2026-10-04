import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import {
  CAPITULOS,
  CIERRE,
  COMUNIDAD,
  FUNDADOR,
  HERO,
  SEO,
} from '~/data/conocenos';
import {useReveal} from '~/lib/useReveal';
import {seoMeta} from '~/lib/seo';
import {siteUrl} from '~/lib/env.server';

/** @type {import('react-router').MetaFunction} */
export const meta = ({data}) =>
  seoMeta({
    origin: data?.origin ?? '',
    path: '/conocenos',
    title: SEO.title,
    description: SEO.description,
    image: HERO.img,
    imageAlt: HERO.alt,
  });

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({request}) {
  return {origin: siteUrl(request)};
}

/** Barra de progreso de lectura (arriba) y capítulo activo para el índice. */
function useLectura(ids) {
  const [activo, setActivo] = useState(ids[0]);

  useEffect(() => {
    const barra = document.documentElement;
    let raf = 0;
    const alScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const art = document.getElementById('historia');
        if (!art) return;
        const r = art.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.6;
        const avance = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
        barra.style.setProperty('--lectura', String(avance));
      });
    };
    alScroll();
    window.addEventListener('scroll', alScroll, {passive: true});
    window.addEventListener('resize', alScroll);

    let obs = null;
    if ('IntersectionObserver' in window) {
      obs = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => e.isIntersecting && setActivo(e.target.id));
        },
        {rootMargin: '-25% 0px -65% 0px'},
      );
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) obs.observe(el);
      });
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', alScroll);
      window.removeEventListener('resize', alScroll);
      obs?.disconnect();
      barra.style.removeProperty('--lectura');
    };
  }, [ids]);

  return activo;
}

/** Capítulos del índice (fijos: así el observador no se reinicia en cada render). */
const INDICE = [
  ...CAPITULOS.map((c) => ({id: c.id, texto: c.corto})),
  {id: 'tinto', texto: 'Tu primer tinto'},
];
const IDS = INDICE.map((i) => i.id);

export default function Conocenos() {
  useReveal();
  const activo = useLectura(IDS);
  const indice = INDICE;

  return (
    <div className="tx tx-about">
      <div className="tx-about__progreso" aria-hidden="true">
        <span />
      </div>

      {/* ── Presentación ── */}
      <header className="tx-about__hero">
        <div className="tx-container tx-about__hero-grid">
          <div className="tx-about__hero-txt" data-reveal>
            <span className="tx-eyebrow">Conócenos</span>
            <h1 className="tx-display tx-about__h1">{HERO.titulo}</h1>
            <p className="tx-about__frase">{HERO.frase}</p>
            <p className="tx-about__lectura">
              {FUNDADOR.nombre ? `Por ${FUNDADOR.nombre}, fundador de Moriah · ` : ''}
              {HERO.lectura}
            </p>
            <a className="tx-btn tx-btn--ink" href="#casa">
              Leer la historia <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="tx-about__hero-foto" data-reveal>
            <img src={HERO.img} alt={HERO.alt} width={800} height={1000} loading="eager" />
          </div>
        </div>
      </header>

      {/* ── Historia: índice fijo + capítulos ── */}
      <div className="tx-container tx-about__cuerpo" id="historia">
        <nav className="tx-about__indice" aria-label="En esta página">
          <span className="tx-about__indice-t">En esta página</span>
          <ol>
            {indice.map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`} aria-current={activo === i.id ? 'true' : undefined}>
                  {i.texto}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="tx-about__capitulos">
          {CAPITULOS.map((c, n) => (
            <section className="tx-about__cap" id={c.id} key={c.id} data-reveal>
              <span className="tx-about__num" aria-hidden="true">
                {String(n + 1).padStart(2, '0')}
              </span>
              <h2 className="tx-about__h2">{c.titulo}</h2>

              <div
                className={`tx-about__cols${c.foto ? ` has-fig fig-${c.foto.lado ?? 'der'}` : ''}`}
              >
                <div className="tx-about__txt">
                  {c.parrafos?.map((p) => (
                    <p className="tx-about__p" key={p}>
                      {p}
                    </p>
                  ))}

                  {c.cita ? <blockquote className="tx-about__cita">{c.cita}</blockquote> : null}

                  {c.despues?.map((p) => (
                    <p className="tx-about__p" key={p}>
                      {p}
                    </p>
                  ))}

                  {c.destacado ? <p className="tx-about__destacado">{c.destacado}</p> : null}

                  {c.id === 'nombre' ? (
                    <div className="tx-about__sello">
                      <img
                        src="/images/logo-moriah.png"
                        alt="Emblema de MORIAH: montaña, sol y agua"
                        width={120}
                        height={120}
                        loading="lazy"
                      />
                      <span>Un café para el alma</span>
                    </div>
                  ) : null}

                  {c.cta ? (
                    <Link className="tx-about__cta" to={c.cta.to}>
                      {c.cta.texto} <span aria-hidden="true">→</span>
                    </Link>
                  ) : null}
                </div>

                {c.foto ? (
                  <figure className="tx-about__fig">
                    <img src={c.foto.src} alt={c.foto.alt} width={800} height={1000} loading="lazy" />
                  </figure>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ── Comunidad ── */}
      <section className="tx-about__tinto" id="tinto" aria-labelledby="tinto-t">
        <div className="tx-container tx-about__tinto-inner" data-reveal>
          <span className="tx-about__hashtag">{COMUNIDAD.etiqueta}</span>
          <h2 id="tinto-t" className="tx-display tx-h2">
            {COMUNIDAD.titulo}
          </h2>
          {COMUNIDAD.texto.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <div className="tx-about__acciones">
            <Link className="tx-btn" to="/collections/cafes">
              Compra Moriah
            </Link>
            <Link className="tx-btn tx-btn--fantasma" to={COMUNIDAD.url}>
              Comparte tu historia
            </Link>
          </div>
          <p className="tx-about__firma">
            {FUNDADOR.nombre ? `${FUNDADOR.nombre}, fundador de Moriah` : null}
            <strong>{CIERRE}</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
