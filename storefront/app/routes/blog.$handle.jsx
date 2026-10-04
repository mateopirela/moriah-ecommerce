import {Link, useLoaderData} from 'react-router';
import {articulosOrdenados, formatFecha, getArticulo} from '~/data/articulos';
import {BlogCard} from '~/components/BlogCard';
import {seoMeta} from '~/lib/seo';
import {siteUrl} from '~/lib/env.server';

/** @type {import('react-router').MetaFunction} */
export const meta = ({data}) => {
  const a = data?.articulo;
  if (!a) return [{title: 'Artículo no encontrado · MORIAH Café'}];
  return seoMeta({
    origin: data.origin,
    path: `/blog/${a.handle}`,
    title: `${a.title} · Notas de café MORIAH`,
    description: a.excerpt,
    image: a.img,
    imageAlt: a.title,
    type: 'article',
  });
};

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({params, request}) {
  const articulo = getArticulo(params.handle);
  if (!articulo) throw new Response('Not Found', {status: 404});
  const otros = articulosOrdenados()
    .filter((a) => a.handle !== articulo.handle)
    .slice(0, 3);
  return {articulo, otros, origin: siteUrl(request)};
}

/** @param {{block: {type: string, text?: string, items?: string[]}}} props */
function Bloque({block}) {
  switch (block.type) {
    case 'h2':
      return <h2>{block.text}</h2>;
    case 'ul':
      return (
        <ul>
          {block.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {block.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      );
    case 'quote':
      return <blockquote>{block.text}</blockquote>;
    default:
      return <p>{block.text}</p>;
  }
}

export default function Articulo() {
  const {articulo, otros} = useLoaderData();

  return (
    <div className="tx-page tx-blog-page">
      <article className="tx-blog-article">
        <Link className="tx-blog-back" to="/blog">
          ← Todas las notas
        </Link>
        <header className="tx-blog-article__head">
          <span className="tx-blog-feature__cat">{articulo.category}</span>
          <h1 className="tx-display tx-h1">{articulo.title}</h1>
          <p className="tx-blog-meta">
            <time dateTime={articulo.date}>{formatFecha(articulo.date)}</time> ·{' '}
            {articulo.minutes} min de lectura
          </p>
        </header>
        <img
          className="tx-blog-article__cover"
          src={articulo.img}
          alt=""
          width={1200}
          height={960}
        />
        <div className="tx-blog-prose">
          {articulo.body.map((b, i) => (
            <Bloque block={b} key={i} />
          ))}
        </div>

        <aside className="tx-blog-cta">
          <p>¿Listo para probarlo en casa?</p>
          <Link className="tx-btn" to="/collections/cafes">
            Ver nuestros cafés
          </Link>
        </aside>
      </article>

      {otros.length ? (
        <section className="tx-page-section tx-blog-more">
          <h2 className="tx-display tx-h3">Sigue leyendo</h2>
          <div className="tx-blog-grid">
            {otros.map((a) => (
              <BlogCard articulo={a} key={a.handle} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
