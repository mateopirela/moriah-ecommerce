import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Money} from '~/components/Money';
import {useVariantUrl} from '~/lib/variants';
import {IconArrowRight} from '~/components/Icons';

// Tags que actúan como badge de la tarjeta, en orden de prioridad.
const BADGE_PRIORITY = [
  '15% DCTO',
  'De la casa',
  'Origen especial',
  'Edición Limitada',
];

/**
 * Branded MORIAH product card. Used on the homepage and collection grid.
 * Badge + origin + flavor notes are pulled from product tags / description
 * when available, with graceful fallbacks.
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const tags = 'tags' in product ? product.tags || [] : [];
  // Shopify devuelve los tags en orden alfabético, así que el badge se elige
  // por prioridad y no por posición.
  const badge = BADGE_PRIORITY.find((b) => tags.includes(b)) || null;
  const restTags = tags.filter((t) => t !== badge);
  const origin = 'vendor' in product ? product.vendor : undefined;

  return (
    <article className="product-card">
      {badge && <span className="badge badge--gold product-card__badge">{badge}</span>}
      <Link
        className="product-card__media"
        prefetch="intent"
        to={variantUrl}
        aria-label={product.title}
      >
        {image ? (
          <Image
            alt={image.altText || product.title}
            aspectRatio="4/5"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 420px, 50vw"
          />
        ) : null}
      </Link>
      <div className="product-card__body">
        {origin && <span className="product-card__origin">{origin}</span>}
        <Link to={variantUrl} prefetch="intent">
          <h3 className="product-card__title">{product.title}</h3>
        </Link>
        {restTags.length > 0 && (
          <div className="tag-row">
            {restTags.slice(0, 3).map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="product-card__foot">
          <span className="price">
            <Money as="span" data={product.priceRange.minVariantPrice} />
          </span>
          <Link className="quick-add" to={variantUrl} prefetch="intent">
            Ver café
            <IconArrowRight width={15} height={15} style={{display: 'inline', verticalAlign: '-2px', marginLeft: 4}} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
