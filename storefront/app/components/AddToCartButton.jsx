import {CartForm} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {IconCheck} from '~/components/Icons';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   className?: string;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  className,
  disabled,
  lines,
  onClick,
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <AtcButton
            fetcher={fetcher}
            className={className}
            onClick={onClick}
            disabled={disabled}
          >
            {children}
          </AtcButton>
        </>
      )}
    </CartForm>
  );
}

const SUCCESS_FLASH_MS = 1600;

/**
 * Botón con feedback de confirmación: al completar el agregado muestra
 * brevemente un check + "Agregado" antes de volver al estado normal.
 * @param {{
 *   fetcher: FetcherWithComponents;
 *   children: React.ReactNode;
 *   className?: string;
 *   disabled?: boolean;
 *   onClick?: () => void;
 * }}
 */
function AtcButton({fetcher, children, className, disabled, onClick}) {
  const [justAdded, setJustAdded] = useState(false);
  const wasSubmitting = useRef(false);

  useEffect(() => {
    if (fetcher.state !== 'idle') {
      wasSubmitting.current = true;
      return;
    }
    if (wasSubmitting.current) {
      wasSubmitting.current = false;
      setJustAdded(true);
      const timeout = setTimeout(() => setJustAdded(false), SUCCESS_FLASH_MS);
      return () => clearTimeout(timeout);
    }
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

/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
