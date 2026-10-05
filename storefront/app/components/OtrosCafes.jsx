import {Link} from 'react-router';
import {CAFES, formatCop} from '~/data/cafes';

/**
 * "Otros cafés que te pueden gustar": tres cafés distintos al que se está viendo,
 * con el mismo arco de color que las tarjetas del catálogo.
 */
export function OtrosCafes({actual}) {
  const otros = CAFES.filter((c) => c.handle !== actual);
  const i = Math.max(0, CAFES.findIndex((c) => c.handle === actual));
  // Los tres siguientes en el orden del catálogo (así cada café propone otros distintos).
  const elegidos = [1, 2, 3].map((n) => CAFES[(i + n) % CAFES.length]).filter((c) => otros.includes(c));
  if (!elegidos.length) return null;

  return (
    <section className="otros" aria-labelledby="otros-title">
      <div className="tx-container">
        <h2 id="otros-title" className="tx-display tx-h2 otros__titulo">
          Otros cafés que te pueden gustar
        </h2>
        <div className="otros__grid">
          {elegidos.map((c) => (
            <Link className="otros__card" to={`/products/${c.handle}`} key={c.handle} prefetch="intent">
              <span className="otros__media" style={{'--tono': c.tono}}>
                <img src={c.heroImage ?? c.image} alt="" width={300} height={380} loading="lazy" />
              </span>
              <span className="otros__nombre">{c.title}</span>
              <span className="otros__notas">{c.flavor ?? c.notes}</span>
              <span className="otros__precio">{formatCop(c.price)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
