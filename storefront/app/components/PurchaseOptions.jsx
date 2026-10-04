import {useState} from 'react';
import {Link} from 'react-router';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {StickyAtc} from '~/components/StickyAtc';
import {IconBag, IconCheck} from '~/components/Icons';
import {
  GRINDS,
  SIZES,
  SUBSCRIPTION,
  formatCop,
  unitPrice,
} from '~/lib/catalog';

/**
 * Caja de compra de un café: compra única (→ carrito) o suscripción al Club
 * (→ /suscripcion con la selección precargada), gramaje, molienda y cantidad.
 * @param {{cafe: any}} props
 */
export function PurchaseOptions({cafe}) {
  const {open} = useAside();
  const [type, setType] = useState('once'); // 'once' | 'sub'
  const [frequency, setFrequency] = useState(SUBSCRIPTION.defaultFrequency);
  const [size, setSize] = useState(SIZES[0].label);
  const [grind, setGrind] = useState(GRINDS[0]);
  const [qty, setQty] = useState(1);

  const oncePrice = unitPrice(cafe.handle, {size});
  const subPrice = unitPrice(cafe.handle, {size, subscription: true});
  const unit = type === 'sub' ? subPrice : oncePrice;
  const total = unit * qty;

  const subscriptionHref = `/suscripcion?${new URLSearchParams({
    cafe: cafe.handle,
    size,
    grind,
    freq: frequency,
    qty: String(qty),
  }).toString()}`;

  return (
    <div className="purchase">
      {/* Tipo de compra */}
      <div className="buy-type" role="radiogroup" aria-label="Tipo de compra">
        <button
          type="button"
          className="buy-type__opt"
          role="radio"
          aria-checked={type === 'once'}
          data-active={type === 'once'}
          onClick={() => setType('once')}
        >
          <span className="buy-type__head">
            <span className="buy-type__dot" />
            Compra única
          </span>
          <span className="buy-type__price">{formatCop(oncePrice)}</span>
        </button>

        <button
          type="button"
          className="buy-type__opt buy-type__opt--sub"
          role="radio"
          aria-checked={type === 'sub'}
          data-active={type === 'sub'}
          onClick={() => setType('sub')}
        >
          <span className="buy-type__head">
            <span className="buy-type__dot" />
            Suscríbete y ahorra
            <span className="buy-type__save">−{Math.round(SUBSCRIPTION.discount * 100)}%</span>
          </span>
          <span className="buy-type__price">
            {formatCop(subPrice)}
            <s>{formatCop(oncePrice)}</s>
          </span>
        </button>
      </div>

      {type === 'sub' && (
        <div className="sub-detail">
          <label className="variant-group__label" htmlFor="freq">
            Frecuencia de entrega
          </label>
          <select
            id="freq"
            className="select"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            {SUBSCRIPTION.frequencies.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <ul className="sub-perks">
            {SUBSCRIPTION.perks.map((p) => (
              <li key={p}>
                <IconCheck width={15} height={15} aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gramaje */}
      <div className="variant-group">
        <span className="variant-group__label">
          Gramaje <span>· {size}</span>
        </span>
        <div className="variant-options">
          {SIZES.map((s) => (
            <button
              key={s.label}
              type="button"
              className="variant-option"
              data-selected={s.label === size}
              onClick={() => setSize(s.label)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Molienda */}
      <div className="variant-group">
        <label className="variant-group__label" htmlFor="grind">
          Molienda
        </label>
        <select
          id="grind"
          className="select"
          value={grind}
          onChange={(e) => setGrind(e.target.value)}
        >
          {GRINDS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Cantidad + CTA */}
      <div className="pdp-buy">
        <div className="pdp-buy__row">
          <div className="qty-stepper" aria-label="Cantidad">
            <button
              type="button"
              aria-label="Disminuir cantidad"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              &minus;
            </button>
            <output>{qty}</output>
            <button
              type="button"
              aria-label="Aumentar cantidad"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
            >
              +
            </button>
          </div>
          {type === 'sub' ? (
            <Link className="btn btn--lg btn--block" to={subscriptionHref}>
              Suscribirme · {formatCop(total)}/entrega
            </Link>
          ) : (
            <AddToCartButton
              className="btn btn--lg btn--block"
              handle={cafe.handle}
              size={size}
              grind={grind}
              quantity={qty}
              product={{handle: cafe.handle, title: cafe.title, price: oncePrice}}
              onClick={() => open('cart')}
            >
              <IconBag width={18} height={18} aria-hidden="true" />
              Agregar · {formatCop(total)}
            </AddToCartButton>
          )}
        </div>
        <p className="pay-line">
          <IconCheck width={14} height={14} aria-hidden="true" /> Paga con Nequi, PSE o tarjeta
          · Entrega 2–5 días
        </p>
      </div>

      {type === 'once' && (
        <StickyAtc
          product={{handle: cafe.handle, title: cafe.title, image: cafe.image}}
          price={oncePrice}
          size={size}
          grind={grind}
        />
      )}
    </div>
  );
}
