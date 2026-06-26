import {IconCheck, IconTruck} from '~/components/Icons';

/** Free-shipping threshold in store currency (COP). Lifts AOV 5–15%. */
export const FREE_SHIP_THRESHOLD = 100000;

/**
 * Progress bar shown at the top of the cart drawer.
 * @param {{subtotal: number, currency?: string}} props
 */
export function FreeShipBar({subtotal = 0, currency = 'COP'}) {
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const done = remaining === 0;

  const fmt = (n) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className={`freeship ${done ? 'freeship--done' : ''}`}>
      <p className="freeship__label">
        {done ? (
          <>
            <IconCheck width={16} height={16} style={{display: 'inline', verticalAlign: '-2px'}} />{' '}
            <strong>¡Tienes envío gratis!</strong>
          </>
        ) : (
          <>
            <IconTruck width={16} height={16} style={{display: 'inline', verticalAlign: '-3px'}} />{' '}
            Te faltan <strong>{fmt(remaining)}</strong> para el envío gratis
          </>
        )}
      </p>
      <div
        className="freeship__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIP_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_SHIP_THRESHOLD)}
      >
        <div className="freeship__fill" style={{width: `${pct}%`}} />
      </div>
    </div>
  );
}
