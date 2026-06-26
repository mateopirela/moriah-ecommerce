import {useMemo, useState} from 'react';
import {
  SIZES,
  GRINDS,
  SUBSCRIPTION,
  subscriptionPrice,
  formatCop,
} from '~/data/cafes';
import {IconWhatsapp, IconCheck, IconGift} from '~/components/Icons';

/** Round to the nearest 100 COP. */
function round100(n) {
  return Math.round(n / 100) * 100;
}

/**
 * Interactive purchase box for a seed café: one-time vs subscription (−15%),
 * frequency, size (gramaje), grind, quantity, gift note, dynamic price and a
 * WhatsApp order CTA carrying the full selection. Mirrors how the Shopify PDP
 * will behave once selling plans + variants are connected.
 * @param {{cafe: any, whatsapp?: string}}
 */
export function PurchaseOptions({cafe, whatsapp = ''}) {
  const [type, setType] = useState('once'); // 'once' | 'sub'
  const [frequency, setFrequency] = useState(SUBSCRIPTION.defaultFrequency);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [grind, setGrind] = useState(GRINDS[0]);
  const [qty, setQty] = useState(1);
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  const basePrice = round100(cafe.price * SIZES[sizeIdx].mult);
  const unit = type === 'sub' ? subscriptionPrice(basePrice) : basePrice;
  const total = unit * qty;

  const waHref = useMemo(() => {
    const lines = [
      `Hola MORIAH, quiero pedir:`,
      `• ${cafe.title} (${SIZES[sizeIdx].label}, ${grind})`,
      `• Cantidad: ${qty}`,
      type === 'sub'
        ? `• Suscripción Club Moriah — ${frequency} (−15%)`
        : `• Compra única`,
      `• Total: ${formatCop(total, cafe.currency)}`,
    ];
    if (giftNote.trim()) lines.push(`• Nota de regalo: ${giftNote.trim()}`);
    const base = whatsapp ? `https://wa.me/${whatsapp}` : 'https://wa.me/';
    return `${base}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [cafe, sizeIdx, grind, qty, type, frequency, total, giftNote, whatsapp]);

  return (
    <div className="purchase">
      {/* Purchase type */}
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
          <span className="buy-type__price">{formatCop(basePrice, cafe.currency)}</span>
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
            <span className="buy-type__save">−15%</span>
          </span>
          <span className="buy-type__price">
            {formatCop(subscriptionPrice(basePrice), cafe.currency)}
            <s>{formatCop(basePrice, cafe.currency)}</s>
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
                <IconCheck width={15} height={15} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Size */}
      <div className="variant-group">
        <span className="variant-group__label">
          Gramaje <span>· {SIZES[sizeIdx].label}</span>
        </span>
        <div className="variant-options">
          {SIZES.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className="variant-option"
              data-selected={i === sizeIdx}
              onClick={() => setSizeIdx(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grind */}
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

      {/* Gift note */}
      <button
        type="button"
        className="gift-toggle"
        aria-expanded={giftOpen}
        onClick={() => setGiftOpen((v) => !v)}
      >
        <IconGift width={18} height={18} />
        ¿Es un regalo? Añade una nota
      </button>
      {giftOpen && (
        <textarea
          className="gift-note"
          rows={2}
          maxLength={200}
          placeholder="Escribe tu mensaje (lo incluimos en una postal)…"
          value={giftNote}
          onChange={(e) => setGiftNote(e.target.value)}
        />
      )}

      {/* Quantity + CTA */}
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
          <a
            className="btn btn--lg btn--block"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsapp width={18} height={18} />
            {type === 'sub' ? 'Suscribirme' : 'Pedir ahora'} ·{' '}
            {formatCop(total, cafe.currency)}
          </a>
        </div>
        <p className="pay-line">
          <IconCheck width={14} height={14} /> Paga con Nequi, PSE o tarjeta ·
          Entrega 2–4 días
        </p>
      </div>
    </div>
  );
}
