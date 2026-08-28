import {useEffect, useRef, useState} from 'react';
import {CART_ACTIONS, CartForm} from '~/components/CartForm';
import {IconCheck} from '~/components/Icons';
import {analytics} from '~/lib/analytics';

const SUCCESS_FLASH_MS = 1600;

/**
 * Botón "Agregar al carrito" con confirmación visual.
 * @param {{
 *   handle: string,
 *   size?: string|null,
 *   grind?: string|null,
 *   quantity?: number,
 *   product?: {handle: string, title: string, price?: number, unitPrice?: number},
 *   children: React.ReactNode,
 *   className?: string,
 *   disabled?: boolean,
 *   onClick?: () => void,
 * }} props
 */
export function AddToCartButton({
  handle,
  size,
  grind,
  quantity = 1,
  product,
  children,
  className,
  disabled,
  onClick,
}) {
  return (
    <CartForm
      action={CART_ACTIONS.ADD}
      fetcherKey={`add-${handle}-${size ?? ''}-${grind ?? ''}`}
      inputs={{handle, size, grind, quantity}}
    >
      {(fetcher) => (
        <AtcButton
          fetcher={fetcher}
          className={className}
          disabled={disabled}
          onClick={() => {
            if (product) analytics.addToCart(product, quantity);
            onClick?.();
          }}
        >
          {children}
        </AtcButton>
      )}
    </CartForm>
  );
}

/**
 * Al completar el agregado muestra brevemente un check + "Agregado".
 * @param {{
 *   fetcher: import('react-router').FetcherWithComponents<any>,
 *   children: React.ReactNode, className?: string, disabled?: boolean, onClick?: () => void,
 * }} props
 */
function AtcButton({fetcher, children, className, disabled, onClick}) {
  const [justAdded, setJustAdded] = useState(false);
  const wasSubmitting = useRef(false);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      wasSubmitting.current = true;
      return undefined;
    }
    if (wasSubmitting.current) {
      wasSubmitting.current = false;
      setJustAdded(true);
      const timeout = setTimeout(() => setJustAdded(false), SUCCESS_FLASH_MS);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [fetcher.state]);

  return (
    <button
      type="submit"
      className={`${className ?? ''}${justAdded ? ' atc-success' : ''}`}
      onClick={onClick}
      disabled={disabled ?? fetcher.state !== 'idle'}
      aria-live="polite"
    >
      {justAdded ? (
        <span className="atc-success__inner">
          <IconCheck width={16} height={16} aria-hidden="true" />
          Agregado
        </span>
      ) : (
        children
      )}
    </button>
  );
}
