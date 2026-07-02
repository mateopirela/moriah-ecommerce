import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {CartUpsell} from '~/components/CartUpsell';
import {FreeShipBar} from '~/components/FreeShipBar';
import {IconBag} from '~/components/Icons';
/**
 * Returns a map of all line items and their children.
 * @param {CartLine[]} lines
 * @return {import("C:/Users/mateo/OneDrive/Desktop/Moriah E-commerce/storefront/app/components/CartMain").LineItemChildrenMap}
 */
function getLineItemChildrenMap(lines) {
  const children = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);
  const subtotal = Number(cart?.cost?.subtotalAmount?.amount ?? 0);
  const currency = cart?.cost?.subtotalAmount?.currencyCode ?? 'COP';

  return (
    <section
      className={className}
      aria-label={layout === 'page' ? 'Página del carrito' : 'Carrito'}
    >
      <CartEmpty hidden={linesCount} layout={layout} />
      {cartHasItems && <FreeShipBar subtotal={subtotal} currency={currency} />}
      <div className="cart-details">
        <p id="cart-lines" className="sr-only">
          Productos en el carrito
        </p>
        <div>
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
              // we do not render non-parent lines at the root of the cart
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              ) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
          {cartHasItems && layout === 'aside' && <CartUpsell cart={cart} />}
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </section>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="cart-empty">
      <IconBag width={42} height={42} />
      <p className="quote">Tu carrito está esperando su primer café.</p>
      <p className="muted">
        Selecciona una edición de especialidad y compártela con quienes amas.
      </p>
      <Link
        className="btn"
        to="/collections/cafes"
        onClick={close}
        prefetch="viewport"
      >
        Descubrir cafés
      </Link>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */
/** @typedef {{[parentId: string]: CartLine[]}} LineItemChildrenMap */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartLineItem').CartLine} CartLine */
