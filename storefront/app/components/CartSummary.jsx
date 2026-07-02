import {CartForm} from '@shopify/hydrogen';
import {Money} from '~/components/Money';
import {IconShield} from '~/components/Icons';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

/**
 * Suma los totales de línea como respaldo cuando el carrito optimista
 * aún no trae `cost.subtotalAmount` (evita mostrar "-" tras agregar).
 * @param {CartSummaryProps['cart']} cart
 */
function getSubtotal(cart) {
  const direct = cart?.cost?.subtotalAmount;
  if (direct?.amount) return direct;

  const lines = cart?.lines?.nodes ?? [];
  let total = 0;
  let currencyCode = 'COP';
  for (const line of lines) {
    const amount = Number(line?.cost?.totalAmount?.amount ?? 0);
    if (line?.cost?.totalAmount?.currencyCode) {
      currencyCode = line.cost.totalAmount.currencyCode;
    }
    total += amount;
  }
  if (total > 0) return {amount: String(total), currencyCode};
  return null;
}

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();
  const subtotal = getSubtotal(cart);

  return (
    <div aria-labelledby={summaryId} className={className}>
      <p id={summaryId} className="sr-only">
        Resumen del pedido
      </p>
      <dl role="group" className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>{subtotal ? <Money data={subtotal} /> : <span aria-label="Calculando">…</span>}</dd>
      </dl>
      <p className="cart-subtotal__note">
        Envío e impuestos se calculan en el checkout.
      </p>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      <p className="cart-payments">
        <IconShield width={15} height={15} aria-hidden="true" />
        <span>
          Pago seguro · <strong>Nequi</strong> · <strong>PSE</strong> ·{' '}
          <strong>Tarjetas</strong>
        </span>
      </p>
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
      />
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <a className="cart-checkout-btn" href={checkoutUrl} target="_self">
      Finalizar compra
      <span aria-hidden="true">&rarr;</span>
    </a>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 *   discountsHeadingId: string;
 *   discountCodeInputId: string;
 * }}
 */
function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label="Códigos de descuento">
      {/* Código aplicado: mostrarlo con opción de quitar */}
      <dl hidden={!codes.length} className="cart-code-applied">
        <div>
          <dt id={discountsHeadingId}>Descuento aplicado</dt>
          <UpdateDiscountForm>
            <dd
              className="cart-discount"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <code>{codes?.join(', ')}</code>
              <button type="submit" aria-label="Quitar descuento">
                Quitar
              </button>
            </dd>
          </UpdateDiscountForm>
        </div>
      </dl>

      {!codes.length && (
        <details className="cart-code">
          <summary>¿Tienes un código de descuento?</summary>
          <UpdateDiscountForm discountCodes={codes}>
            <div className="cart-code__form">
              <label htmlFor={discountCodeInputId} className="sr-only">
                Código de descuento
              </label>
              <input
                id={discountCodeInputId}
                type="text"
                name="discountCode"
                placeholder="Código de descuento"
              />
              <button type="submit" aria-label="Aplicar código de descuento">
                Aplicar
              </button>
            </div>
          </UpdateDiscountForm>
        </details>
      )}
    </section>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 *   giftCardHeadingId: string;
 *   giftCardInputId: string;
 * }}
 */
function CartGiftCard({giftCardCodes, giftCardHeadingId, giftCardInputId}) {
  const giftCardCodeInput = useRef(null);
  const removeButtonRefs = useRef(new Map());
  const previousCardIdsRef = useRef([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label="Tarjetas de regalo">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl className="cart-code-applied">
          <dt id={giftCardHeadingId}>Tarjeta de regalo aplicada</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="cart-discount">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <details className="cart-code">
        <summary>¿Tienes una tarjeta de regalo?</summary>
        <AddGiftCardForm fetcherKey="gift-card-add">
          <div className="cart-code__form">
            <label htmlFor={giftCardInputId} className="sr-only">
              Código de tarjeta de regalo
            </label>
            <input
              id={giftCardInputId}
              type="text"
              name="giftCardCode"
              placeholder="Código de tarjeta de regalo"
              ref={giftCardCodeInput}
            />
            <button
              type="submit"
              disabled={giftCardAddFetcher.state !== 'idle'}
              aria-label="Aplicar tarjeta de regalo"
            >
              Aplicar
            </button>
          </div>
        </AddGiftCardForm>
      </details>
    </section>
  );
}

/**
 * @param {{
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   lastCharacters: string;
 *   children: React.ReactNode;
 *   onRemoveClick?: () => void;
 *   buttonRef?: (el: HTMLButtonElement | null) => void;
 * }}
 */
function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
      &nbsp;
      <button
        type="submit"
        aria-label={`Quitar tarjeta de regalo terminada en ${lastCharacters}`}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        Quitar
      </button>
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
