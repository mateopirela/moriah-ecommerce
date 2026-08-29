import {useEffect, useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {IconPlus} from '~/components/Icons';
import {formatCop} from '~/lib/catalog';

/**
 * Upsell del carrito: sugiere hasta 2 productos que no estén ya en el carrito.
 *
 * Usa `fetch` directo (no `useFetcher`) a propósito: /api/cart-upsell es un
 * resource route público que devuelve JSON y no necesita estado del router.
 * Con `useFetcher` la petición se emitía antes de que el cliente descubriera
 * la ruta (lazy route discovery), salía como `_routes=routes/$`, devolvía `[{}]`
 * y el error escalaba hasta el ErrorBoundary raíz: el cliente veía "Oops 500"
 * justo después de agregar un producto.
 *
 * @param {{cart: import('~/lib/cart').Cart}} props
 */
export function CartUpsell({cart}) {
  const [suggested, setSuggested] = useState([]);

  const handlesInCart = (cart?.lines ?? []).map((line) => line.handle);
  const excludeKey = [...handlesInCart].sort().join(',');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/cart-upsell?exclude=${encodeURIComponent(excludeKey)}`, {
      signal: controller.signal,
      headers: {Accept: 'application/json'},
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setSuggested(data?.products ?? []))
      .catch(() => {
        // Una sugerencia fallida nunca debe romper el carrito.
      });
    return () => controller.abort();
  }, [excludeKey]);

  const products = suggested.filter(
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
