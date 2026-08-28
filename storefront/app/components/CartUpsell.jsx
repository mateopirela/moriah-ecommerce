import {useEffect} from 'react';
import {useFetcher} from 'react-router';
import {AddToCartButton} from '~/components/AddToCartButton';
import {IconPlus} from '~/components/Icons';
import {formatCop} from '~/lib/catalog';

/**
 * Upsell del carrito: sugiere hasta 2 productos que no estén ya en el carrito.
 * @param {{cart: import('~/lib/cart').Cart}} props
 */
export function CartUpsell({cart}) {
  const fetcher = useFetcher();

  const handlesInCart = (cart?.lines ?? []).map((line) => line.handle);
  const excludeKey = [...handlesInCart].sort().join(',');

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
        {products.map((product) => (
          <li key={product.handle} className="cart-upsell__item">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                width={56}
                height={56}
                loading="lazy"
                style={{aspectRatio: '1 / 1', objectFit: 'cover'}}
              />
            )}
            <div className="cart-upsell__info">
              <p className="cart-upsell__name">{product.title}</p>
              <p className="cart-upsell__price">{formatCop(product.price)}</p>
            </div>
            <AddToCartButton
              className="cart-upsell__add"
              handle={product.handle}
              product={product}
              quantity={1}
            >
              <IconPlus width={14} height={14} aria-hidden="true" />
              <span>Agregar</span>
            </AddToCartButton>
          </li>
        ))}
      </ul>
    </div>
  );
}
