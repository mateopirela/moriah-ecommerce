import {useEffect, useRef, useState} from 'react';
import {Link, useFetcher, useNavigate} from 'react-router';
import {useAside} from '~/components/Aside';
import {formatCop} from '~/lib/catalog';

/** Búsqueda instantánea sobre el catálogo (panel lateral). */
export function SearchPredictive() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const {close, type} = useAside();
  const [term, setTerm] = useState('');
  const inputRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    if (type === 'search') inputRef.current?.focus();
  }, [type]);

  const search = (value) => {
    setTerm(value);
    clearTimeout(timer.current);
    if (!value.trim()) return;
    timer.current = setTimeout(() => {
      fetcher.load(`/api/search?q=${encodeURIComponent(value.trim())}`);
    }, 200);
  };

  const goToSearch = (event) => {
    event.preventDefault();
    if (!term.trim()) return;
    close();
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  const results = term.trim() ? fetcher.data?.products ?? [] : [];

  return (
    <div className="predictive-search">
      <form className="predictive-search__form" onSubmit={goToSearch}>
        <input
          name="q"
          value={term}
          onChange={(e) => search(e.target.value)}
          placeholder="Busca tu café…"
          ref={inputRef}
          type="search"
          autoComplete="off"
        />
        <button className="btn btn--dark" type="submit">
          Buscar
        </button>
      </form>

      {term.trim() && fetcher.state !== 'idle' && !fetcher.data && <div>Buscando…</div>}

      {term.trim() && fetcher.data && results.length === 0 && (
        <p>
          No encontramos resultados para <q>{term}</q>.
        </p>
      )}

      {results.length > 0 && (
        <div className="predictive-search-result">
          <h5>Productos</h5>
          <ul>
            {results.map((product) => (
              <li className="predictive-search-result-item" key={product.handle}>
                <Link to={`/products/${product.handle}`} onClick={close} prefetch="intent">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      width={50}
                      height={50}
                      loading="lazy"
                      style={{aspectRatio: '1 / 1', objectFit: 'cover'}}
                    />
                  )}
                  <div>
                    <p>{product.title}</p>
                    <small>{formatCop(product.price)}</small>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link onClick={close} to={`/search?q=${encodeURIComponent(term.trim())}`}>
            <p>
              Ver todos los resultados para <q>{term}</q>&nbsp; →
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
