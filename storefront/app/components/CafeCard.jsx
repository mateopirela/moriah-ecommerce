import {Link} from 'react-router';
import {formatCop} from '~/data/cafes';
import {IconArrowRight} from '~/components/Icons';

/**
 * Branded card for a local (seed) café from the MORIAH catalog.
 * @param {{cafe: import('~/data/cafes').CafeSeed, loading?: 'eager'|'lazy'}}
 */
export function CafeCard({cafe, loading = 'lazy'}) {
  const url = `/products/${cafe.handle}`;
  return (
    <article className="product-card">
      {cafe.badge && (
        <span className="badge badge--gold product-card__badge">
          {cafe.badge}
        </span>
      )}
      <Link
        className="product-card__media"
        to={url}
        prefetch="intent"
        aria-label={cafe.title}
      >
        <img
          src={cafe.image}
          alt={cafe.title}
          width={880}
          height={1100}
          loading={loading}
          decoding="async"
        />
      </Link>
      <div className="product-card__body">
        <span className="product-card__origin">{cafe.origin}</span>
        <Link to={url} prefetch="intent">
          <h3 className="product-card__title">{cafe.title}</h3>
        </Link>
        {cafe.notes && <p className="product-card__notes">{cafe.notes}</p>}
        {cafe.tags?.length > 0 && (
          <div className="tag-row">
            {[cafe.roast, ...cafe.tags].filter(Boolean).slice(0, 3).map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="product-card__foot">
          <span className="price">{formatCop(cafe.price, cafe.currency)}</span>
          <Link className="quick-add" to={url} prefetch="intent">
            Ver café
            <IconArrowRight
              width={15}
              height={15}
              style={{display: 'inline', verticalAlign: '-2px', marginLeft: 4}}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** @typedef {object} CafeSeed */
