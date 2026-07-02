import {useEffect} from 'react';
import {useFetcher} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {Money} from '~/components/Money';
import {AddToCartButton} from '~/components/AddToCartButton';
import {IconPlus} from '~/components/Icons';

/**
 * Upsell del carrito: sugiere hasta 2 best-sellers que no estén ya
 * en el carrito, con agregado en un clic. Sube el AOV sin fricción.
 * @param {{cart: CartApiQueryFragment | null}} props
 */
export function CartUpsell({cart}) {
  const fetcher = useFetcher();

  const handlesInCart = (cart?.lines?.nodes ?? [])
    .map((line) => line?.merchandise?.product?.handle)
    .filter(Boolean);
  const excludeKey = handlesInCart.sort().join(',');

  useEffect(() => {
    if (fetcher.state === 'idle') {
      fetcher.load(`/api/cart-upsell?exclude=${encodeURIComponent(excludeKey)}`);
    }
    // Solo recargar cuando cambian los productos del carrito
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excludeKey]);

  const products = (fetcher.data?.products ?? []).filter(
    (product) => !handlesInCart.includes(product.handle),
  );

  if (!products.length) return null;

  return (
    <div className="cart-upsell">
      <p className="cart-upsell__title">Completa tu ritual</p>
      <ul className="cart-upsell__list">
        {products.map((product) => {
          const variant = product.selectedOrFirstAvailableVariant;
          if (!variant) return null;
          return (
            <li key={product.id} className="cart-upsell__item">
              {product.featuredImage && (
                <Image
                  data={product.featuredImage}
                  alt={product.featuredImage.altText || product.title}
                  aspectRatio="1/1"
                  width={56}
                  height={56}
                  loading="lazy"
                  sizes="56px"
                />
              )}
              <div className="cart-upsell__info">
                <p className="cart-upsell__name">{product.title}</p>
                <p className="cart-upsell__price">
                  <Money data={variant.price} />
                </p>
              </div>
              <AddToCartButton
                className="cart-upsell__add"
                lines={[
                  {
                    merchandiseId: variant.id,
                    quantity: 1,
                    selectedVariant: variant,
                  },
                ]}
              >
                <IconPlus width={14} height={14} aria-hidden="true" />
                <span>Agregar</span>
              </AddToCartButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
