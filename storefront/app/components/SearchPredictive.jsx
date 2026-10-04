import {useEffect, useId, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {useAside} from '~/components/Aside';
import {formatCop} from '~/lib/catalog';

const SUGERENCIAS = ['bourbon', 'pacamara', 'tabi', 'pocillo'];

/**
 * Búsqueda instantánea sobre el catálogo (panel lateral).
 *
 * Igual que el upsell del carrito, consulta /api/search con `fetch` directo:
 * es un endpoint JSON público y con `useFetcher` la petición podía salir antes
 * de que el cliente descubriera la ruta y escalar el error al ErrorBoundary raíz.
 */
export function SearchPredictive() {
  const navigate = useNavigate();
  const {close, type} = useAside();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | done
  const inputRef = useRef(null);
  const timer = useRef(null);
  const controller = useRef(null);
  const inputId = useId();

  useEffect(() => {
    if (type === 'search') inputRef.current?.focus();
  }, [type]);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      controller.current?.abort();
    },
    [],
  );

  const search = (value) => {
    setTerm(value);
    clearTimeout(timer.current);
    controller.current?.abort();
    if (!value.trim()) {
      setResults([]);
      setStatus('idle');
      return;
    }
    setStatus('loading');
    timer.current = setTimeout(() => {
      controller.current = new AbortController();
      fetch(`/api/search?q=${encodeURIComponent(value.trim())}`, {
        signal: controller.current.signal,
        headers: {Accept: 'application/json'},
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          setResults(data?.products ?? []);
          setStatus('done');
        })
        .catch((error) => {
          if (error?.name !== 'AbortError') setStatus('done');
        });
    }, 200);
  };

  const goToSearch = (event) => {
    event.preventDefault();
    if (!term.trim()) return;
    close();
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  const hasTerm = Boolean(term.trim());

  return (
    <div className="predictive-search">
      <form className="predictive-search__form" onSubmit={goToSearch} role="search">
        <label htmlFor={inputId} className="sr-only">
          Buscar cafés y productos
        </label>
        <input
          id={inputId}
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

      <div aria-live="polite" aria-atomic="true">
        {hasTerm && status === 'loading' && (
          <p className="predictive-search__status">Buscando…</p>
        )}

        {hasTerm && status === 'done' && results.length === 0 && (
          <div className="predictive-search__empty">
            <p>
              No encontramos resultados para <q>{term}</q>.
            </p>
            <p className="predictive-search__hint">
              Prueba con{' '}
              {SUGERENCIAS.map((s, i) => (
                <span key={s}>
                  {i > 0 && ', '}
                  <button type="button" className="link-inline" onClick={() => search(s)}>
                    {s}
                  </button>
                </span>
              ))}
              .
            </p>
          </div>
        )}

        {results.length > 0 && (
          <p className="predictive-search__status">
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </p>
        )}
      </div>

      {results.length > 0 && (
        <div className="predictive-search-result">
          <ul>
            {results.map((product) => (
              <li className="predictive-search-result-item" key={product.handle}>
                <Link to={`/products/${product.handle}`} onClick={close} prefetch="intent">
                  {product.image && (
                    <img
                      src={product.image}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      style={{aspectRatio: '1 / 1', objectFit: 'cover'}}
                    />
                  )}
                  <div>
                    <p className="predictive-search-result-item__title">{product.title}</p>
                    <span className="predictive-search-result-item__price">
                      {formatCop(product.price)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="predictive-search__all"
            onClick={close}
            to={`/search?q=${encodeURIComponent(term.trim())}`}
          >
            Ver todos los resultados para <q>{term}</q> &nbsp;→
          </Link>
        </div>
      )}
    </div>
  );
}
