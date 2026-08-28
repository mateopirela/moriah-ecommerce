import {Link, useFetchers} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from '~/components/CartSummary';
import {CartUpsell} from '~/components/CartUpsell';
import {FreeShipBar} from '~/components/FreeShipBar';
import {IconBag} from '~/components/Icons';
import {CART_ACTIONS} from '~/components/CartForm';
import {addLine, buildCart, removeLine, updateLine} from '~/lib/cart';

/**
 * Aplica las mutaciones en vuelo (fetchers hacia /cart) al carrito del loader
 * para que la UI responda al instante.
 * @param {import('~/lib/cart').Cart} cart
 */
export function useOptimisticCart(cart) {
  const fetchers = useFetchers();
  let raw = (cart?.lines ?? []).map(({id, handle, size, grind, quantity}) => ({
    id,
    handle,
    size,
    grind,
    quantity,
  }));
  let changed = false;

  for (const fetcher of fetchers) {
    if (!fetcher.formData) continue;
    const target = fetcher.formAction?.split('?')[0];
    if (target !== '/cart') continue;
    const fd = fetcher.formData;
    switch (fd.get('cartAction')) {
      case CART_ACTIONS.ADD:
        raw = addLine(raw, {
          handle: String(fd.get('handle') ?? ''),
          size: fd.get('size') ?? undefined,
          grind: fd.get('grind') ?? undefined,
          quantity: Number(fd.get('quantity') ?? 1),
        });
        changed = true;
        break;
      case CART_ACTIONS.UPDATE:
        raw = updateLine(raw, String(fd.get('lineId')), Number(fd.get('quantity')));
        changed = true;
        break;
      case CART_ACTIONS.REMOVE:
        raw = removeLine(raw, String(fd.get('lineId')));
        changed = true;
        break;
      case CART_ACTIONS.CLEAR:
        raw = [];
        changed = true;
        break;
      default:
        break;
    }
  }

  if (!changed) return cart;
  const optimistic = buildCart(raw, {discountCode: cart?.discount?.code});
  const previousIds = new Set((cart?.lines ?? []).map((l) => l.id));
  return {
    ...optimistic,
    isOptimistic: true,
    lines: optimistic.lines.map((l) => ({...l, isOptimistic: !previousIds.has(l.id)})),
  };
}

/** @param {import('~/lib/cart').Cart} cart */
export function useOptimisticCartCount(cart) {
  return useOptimisticCart(cart)?.totalQuantity ?? 0;
}

/**
 * Carrito principal — usado por la ruta /cart y por el panel lateral.
 * @param {{layout: 'page'|'aside', cart: import('~/lib/cart').Cart}} props
 */
export function CartMain({layout, cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const hasItems = (cart?.lines?.length ?? 0) > 0;

  return (
    <section
      className={`cart-main${cart?.discount ? ' with-discount' : ''}`}
      aria-label={layout === 'page' ? 'Página del carrito' : 'Carrito'}
    >
      <CartEmpty hidden={hasItems} />
      {hasItems && <FreeShipBar subtotal={cart.subtotal} currency={cart.currency} />}
      <div className="cart-details">
        <p id="cart-lines" className="sr-only">
          Productos en el carrito
        </p>
        <div>
          <ul aria-labelledby="cart-lines">
            {(cart?.lines ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
          {hasItems && layout === 'aside' && <CartUpsell cart={cart} />}
        </div>
        {hasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </section>
  );
}

function CartEmpty({hidden = false}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="cart-empty">
      <IconBag width={42} height={42} />
      <p className="quote">Tu carrito está esperando su primer café.</p>
      <p className="muted">
        Selecciona una edición de especialidad y compártela con quienes amas.
      </p>
      <Link className="btn" to="/collections/cafes" onClick={close} prefetch="viewport">
        Descubrir cafés
      </Link>
    </div>
  );
}
