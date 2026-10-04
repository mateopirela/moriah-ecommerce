import {Link} from 'react-router';
import {formatFecha} from '~/data/articulos';

/**
 * Tarjeta de artículo del blog (listado y "Sigue leyendo").
 * @param {{articulo: import('~/data/articulos').ARTICULOS[number], eager?: boolean}} props
 */
export function BlogCard({articulo: a, eager = false}) {
  return (
    <article className="tx-blog-card">
      <Link className="tx-blog-card__img" to={`/blog/${a.handle}`} tabIndex={-1} aria-hidden="true">
        <img src={a.img} alt="" width={600} height={450} loading={eager ? 'eager' : 'lazy'} />
        <span className="tx-blog-card__tag">{a.category}</span>
      </Link>
      <div className="tx-blog-card__txt">
        <h2 className="tx-blog-card__title">
          <Link to={`/blog/${a.handle}`}>{a.title}</Link>
        </h2>
        <p className="tx-blog-meta">
          <time dateTime={a.date}>{formatFecha(a.date)}</time> · {a.minutes} min
        </p>
        <p className="tx-blog-card__excerpt">{a.excerpt}</p>
        <Link className="tx-blog-card__more" to={`/blog/${a.handle}`}>
          Leer más <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
