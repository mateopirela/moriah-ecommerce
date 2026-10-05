import {useId} from 'react';
import {Link} from 'react-router';
import {CART_ACTIONS, CartForm} from '~/components/CartForm';
import {useAside} from '~/components/Aside';
import {IconShield} from '~/components/Icons';
import {formatCop} from '~/lib/catalog';
import {analytics} from '~/lib/analytics';

/**
 * @param {{cart: import('~/lib/cart').Cart, layout: 'page'|'aside'}} props
 */
export function CartSummary({cart, layout}) {
  const className = layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();
  const discountInputId = useId();
  const {close} = useAside();

  return (
    <div aria-labelledby={summaryId} className={className}>
      <p id={summaryId} className="sr-only">
        Resumen del pedido
      </p>
      {/* Subtotal solo cuando difiere del total: evita tres líneas con el mismo número. */}
      {(cart.discount || cart.shipping > 0) && (
        <dl role="group" className="cart-subtotal">
          <dt>Subtotal</dt>
          <dd>{formatCop(cart.subtotal)}</dd>
        </dl>
      )}
      {cart.discount && (
        <dl role="group" className="cart-subtotal">
          <dt>Descuento ({cart.discount.code})</dt>
          <dd>−{formatCop(cart.discount.amount)}</dd>
        </dl>
      )}
      <dl role="group" className="cart-subtotal">
        <dt>Envío</dt>
        <dd>{cart.shipping === 0 ? 'Gratis' : formatCop(cart.shipping)}</dd>
      </dl>
      <dl role="group" className="cart-subtotal cart-subtotal--total">
        <dt>Total</dt>
        <dd>{formatCop(cart.total)}</dd>
      </dl>
      <p className="cart-subtotal__note">Impuestos incluidos.</p>
      <Link
        className="cart-checkout-btn"
        to="/checkout"
        onClick={() => {
          analytics.beginCheckout(cart);
          close();
        }}
        aria-disabled={cart.isOptimistic ? 'true' : undefined}
      >
        Finalizar compra
        <span aria-hidden="true">&rarr;</span>
      </Link>
      <p className="cart-payments">
        <IconShield width={15} height={15} aria-hidden="true" />
        <span>
          Pago seguro con Wompi · <strong>Nequi</strong> · <strong>PSE</strong> ·{' '}
          <strong>Tarjetas</strong>
        </span>
      </p>
      <CartDiscount discount={cart.discount} inputId={discountInputId} />
      {layout === 'aside' && (
        <Link className="cart-seguir cart-seguir--aside" to="/collections/cafes" onClick={close}>
          Seguir comprando
        </Link>
      )}
    </div>
  );
}

/**
 * @param {{discount: import('~/lib/cart').Cart['discount'], inputId: string}} props
 */
function CartDiscount({discount, inputId}) {
  return (
    <section aria-label="Códigos de descuento">
      {discount ? (
        <dl className="cart-code-applied">
          <div>
            <dt>Descuento aplicado</dt>
            <CartForm action={CART_ACTIONS.DISCOUNT} inputs={{code: ''}}>
              <dd className="cart-discount" role="group">
                <code>{discount.code}</code>
                <button type="submit" aria-label="Quitar descuento">
                  Quitar
                </button>
              </dd>
            </CartForm>
          </div>
        </dl>
      ) : (
        <details className="cart-code">
          <summary>¿Tienes un código de descuento?</summary>
          <CartForm action={CART_ACTIONS.DISCOUNT}>
            {(fetcher) => (
              <div className="cart-code__form">
                <label htmlFor={inputId} className="sr-only">
                  Código de descuento
                </label>
                <input
                  id={inputId}
                  type="text"
                  name="code"
                  placeholder="Código de descuento"
                  autoComplete="off"
                />
                <button type="submit" aria-label="Aplicar código de descuento">
                  Aplicar
                </button>
                {fetcher.data?.error && (
                  <p className="form-error" role="alert">
                    {fetcher.data.error}
                  </p>
                )}
              </div>
            )}
          </CartForm>
        </details>
      )}
    </section>
  );
}
