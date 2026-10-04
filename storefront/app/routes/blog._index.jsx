import {Link, useLoaderData} from 'react-router';
import {CAFES, formatCop} from '~/data/cafes';
import {articulosOrdenados} from '~/data/articulos';
import {BlogCard} from '~/components/BlogCard';

/** Artículos por página. Cuando haya más, aparece la paginación sola. */
const PAGE_SIZE = 6;

/** @type {import('react-router').MetaFunction} */
export const meta = () => [
  {title: 'Notas de café · Blog MORIAH'},
  {
    name: 'description',
    content:
      'Recetas, guías y curiosidades sobre el café de especialidad colombiano. El blog de MORIAH Café.',
  },
];

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({request}) {
  const url = new URL(request.url);
  const todos = articulosOrdenados();

  // Categorías con su conteo, en el orden en que aparecen.
  const conteo = new Map();
  todos.forEach((a) => conteo.set(a.category, (conteo.get(a.category) ?? 0) + 1));
  const categorias = [...conteo].map(([nombre, total]) => ({nombre, total}));

  const pedida = url.searchParams.get('categoria');
  const categoria = conteo.has(pedida) ? pedida : null;
  const filtrados = categoria ? todos.filter((a) => a.category === categoria) : todos;

  const paginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const pagina = Math.min(
    paginas,
    Math.max(1, Math.floor(Number(url.searchParams.get('pagina'))) || 1),
  );
  const articulos = filtrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  return {articulos, categorias, categoria, pagina, paginas, total: todos.length};
}

/** Enlace a una combinación de categoría y página (sin parámetros vacíos). */
function href(categoria, pagina) {
  const p = new URLSearchParams();
  if (categoria) p.set('categoria', categoria);
  if (pagina > 1) p.set('pagina', String(pagina));
  const q = p.toString();
  return q ? `/blog?${q}` : '/blog';
}

export default function BlogIndex() {
  const {articulos, categorias, categoria, pagina, paginas, total} = useLoaderData();

  return (
    <div className="tx-page tx-blog-page">
      <section className="tx-page-section">
        <header className="tx-blog-head">
          <span className="tx-eyebrow">Blog MORIAH</span>
          <h1 className="tx-display tx-h1">Notas de café</h1>
          <p className="tx-lede">
            Recetas, guías y curiosidades sobre el café, de la finca a tu taza.
          </p>
        </header>

        {categorias.length > 1 ? (
          <nav className="tx-blog-filters" aria-label="Filtrar por categoría">
            <Link
              to="/blog"
              className={`tx-blog-chip${categoria ? '' : ' is-on'}`}
              aria-current={categoria ? undefined : 'page'}
              preventScrollReset
            >
              Todos <span>{total}</span>
            </Link>
            {categorias.map((c) => (
              <Link
                key={c.nombre}
                to={href(c.nombre, 1)}
                className={`tx-blog-chip${categoria === c.nombre ? ' is-on' : ''}`}
                aria-current={categoria === c.nombre ? 'page' : undefined}
                preventScrollReset
              >
                {c.nombre} <span>{c.total}</span>
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="tx-blog-grid">
          {articulos.map((a, i) => (
            <BlogCard articulo={a} eager={i < 3} key={a.handle} />
          ))}
        </div>

        {paginas > 1 ? (
          <nav className="tx-blog-pager" aria-label="Páginas del blog">
            {pagina > 1 ? (
              <Link to={href(categoria, pagina - 1)} className="tx-blog-pager__nav" rel="prev">
                ← Anterior
              </Link>
            ) : null}
            {Array.from({length: paginas}, (_, n) => n + 1).map((n) => (
              <Link
                key={n}
                to={href(categoria, n)}
                className={`tx-blog-pager__n${n === pagina ? ' is-on' : ''}`}
                aria-current={n === pagina ? 'page' : undefined}
              >
                {n}
              </Link>
            ))}
            {pagina < paginas ? (
              <Link to={href(categoria, pagina + 1)} className="tx-blog-pager__nav" rel="next">
                Siguiente →
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>

      <section className="tx-blog-shop" aria-labelledby="blog-shop-title">
        <div className="tx-container tx-blog-shop__inner">
          <div className="tx-blog-shop__head">
            <span className="tx-eyebrow">Del blog a tu taza</span>
            <h2 id="blog-shop-title" className="tx-display tx-h2">
              Prueba lo que lees
            </h2>
            <p>Café de especialidad tostado fresco, de Pitalito, Huila.</p>
            <Link className="tx-btn" to="/collections/cafes">
              Ver todos los cafés
            </Link>
          </div>
          <div className="tx-blog-shop__list">
            {CAFES.slice(0, 3).map((c) => (
              <Link className="tx-blog-shop__cafe" to={`/products/${c.handle}`} key={c.handle}>
                <img src={c.image} alt="" width={160} height={160} loading="lazy" />
                <span className="tx-blog-shop__tier">{c.tierLabel}</span>
                <span className="tx-blog-shop__name">{c.title}</span>
                <span className="tx-blog-shop__price">{formatCop(c.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
