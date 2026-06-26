import {Link} from 'react-router';
import {BUNDLE, bundlePrice, formatCop} from '~/data/cafes';
import {IconArrowRight} from '~/components/Icons';

/** Launch bundle card — raises AOV ("Kit tres orígenes -15%"). */
export function BundleCard() {
  return (
    <article className="product-card product-card--bundle">
      <span className="badge badge--gold product-card__badge">{BUNDLE.badge}</span>
      <Link
        className="product-card__media"
        to={`/products/${BUNDLE.handle}`}
        prefetch="intent"
        aria-label={BUNDLE.title}
      >
        <img
          src={BUNDLE.image}
          alt={BUNDLE.title}
          width={880}
          height={1100}
          loading="lazy"
        />
      </Link>
      <div className="product-card__body">
        <span className="product-card__origin">Kit de degustación</span>
        <Link to={`/products/${BUNDLE.handle}`} prefetch="intent">
          <h3 className="product-card__title">{BUNDLE.title}</h3>
        </Link>
        <p className="product-card__notes">
          Los 3 orígenes MORIAH · ideal para regalar
        </p>
        <div className="product-card__foot">
          <span className="price">{formatCop(bundlePrice())}</span>
          <Link
            className="quick-add"
            to={`/products/${BUNDLE.handle}`}
            prefetch="intent"
          >
            Ver kit
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
