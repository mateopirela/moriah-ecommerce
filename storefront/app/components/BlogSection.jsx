import {useState} from 'react';
import {Link} from 'react-router';
import {articulosOrdenados, formatFecha} from '~/data/articulos';

/**
 * Sección "Notas de café" del home: panel de marca a la izquierda y, a la
 * derecha, el blog con el artículo destacado y puntos para recorrer los
 * últimos artículos.
 */
export function BlogSection() {
  const articulos = articulosOrdenados().slice(0, 5);
  const [i, setI] = useState(0);
  const actual = articulos[i];
  if (!actual) return null;

  return (
    <section className="tx-section tx-blog-section" aria-labelledby="blog-home-title">
      <div className="tx-blog-split" data-reveal>
        <div className="tx-blog-brand">
          <img
            className="tx-blog-brand__logo"
            src="/images/logo-moriah.png"
            alt=""
            width={96}
            height={96}
            loading="lazy"
          />
          <p className="tx-blog-brand__title" aria-hidden="true">
            Notas
            <br />
            <span>de</span>
            <em>café</em>
          </p>
          <p className="tx-blog-brand__sub">
            Nuestros apuntes sobre el mundo del café de especialidad
          </p>
          <Link className="tx-btn tx-btn--peq tx-blog-brand__cta" to="/blog">
            Ver más
          </Link>
        </div>

        <div className="tx-blog-body">
          <h2 id="blog-home-title" className="tx-display tx-h2 tx-blog-body__h2">
            Blog <span>MORIAH</span>
          </h2>
          <p className="tx-blog-body__lede">
            Un espacio para compartir conocimiento, historias y curiosidades
            sobre el café, de la finca a tu taza.
          </p>
          <Link className="tx-btn tx-btn--peq tx-blog-ghost" to="/blog">
            Ver todos los artículos →
          </Link>

          <article className="tx-blog-feature" key={actual.handle} aria-live="polite">
            <span className="tx-blog-feature__cat">{actual.category}</span>
            <h3 className="tx-blog-feature__title">
              <Link to={`/blog/${actual.handle}`}>{actual.title}</Link>
            </h3>
            <time className="tx-blog-feature__date" dateTime={actual.date}>
              {formatFecha(actual.date)}
            </time>
            <Link className="tx-btn tx-btn--peq" to={`/blog/${actual.handle}`}>
              Leer artículo
            </Link>
          </article>

          {articulos.length > 1 ? (
            <div className="tx-blog-dots" role="tablist" aria-label="Artículos recientes">
              {articulos.map((a, idx) => (
                <button
                  key={a.handle}
                  type="button"
                  role="tab"
                  aria-selected={idx === i}
                  aria-label={a.title}
                  className={`tx-blog-dot${idx === i ? ' is-active' : ''}`}
                  onClick={() => setI(idx)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
