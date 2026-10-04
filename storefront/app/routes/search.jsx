import {useEffect} from 'react';
import {Form, Link, useLoaderData} from 'react-router';
import {formatCop, searchProducts} from '~/lib/catalog';
import {analytics} from '~/lib/analytics';

/** @type {import('react-router').MetaFunction} */
export const meta = ({data}) => [
  {title: data?.term ? `“${data.term}” · Búsqueda · MORIAH Café` : 'Búsqueda · MORIAH Café'},
];

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({request}) {
  const term = (new URL(request.url).searchParams.get('q') ?? '').trim();
  const products = searchProducts(term).map((p) => ({
    handle: p.handle,
    title: p.title,
    price: p.price,
    image: p.image,
    subtitle: p.subtitle,
    notes: p.notes,
  }));
  return {term, products};
}

export default function SearchPage() {
  const {term, products} = useLoaderData();

  useEffect(() => {
    if (term) analytics.search(term);
  }, [term]);

  return (
    <div className="search container">
      <h1 className="display-h2">Buscar</h1>
      <Form method="get" className="predictive-search__form">
        <input defaultValue={term} name="q" placeholder="Busca tu café…" type="search" />
        <button className="btn btn--dark" type="submit">
          Buscar
        </button>
      </Form>

      {term && products.length === 0 && (
        <p>
          No encontramos resultados para <q>{term}</q>. Prueba con “bourbon”, “pacamara” o
          “pocillo”.
        </p>
      )}

      {products.length > 0 && (
        <div className="search-result">
          <h2>Productos</h2>
          <div className="tx-col-grid">
            {products.map((product) => (
              <Link
                key={product.handle}
                to={`/products/${product.handle}`}
                className="tx-col-card"
                prefetch="intent"
              >
                <div className="tx-col-card__media">
                  <img
                    src={product.image}
                    alt={product.title}
                    width={600}
                    height={600}
                    loading="lazy"
                    className="tx-col-card__img tx-col-card__img--primary"
                  />
                </div>
                <div className="tx-col-card__info">
                  <h3 className="tx-col-card__name">{product.title}</h3>
                  {product.notes && <p className="tx-col-card__notes">{product.notes}</p>}
                  <div className="tx-col-card__price">{formatCop(product.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
