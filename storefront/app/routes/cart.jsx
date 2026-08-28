import {data, redirect, useLoaderData} from 'react-router';
import {CartMain} from '~/components/CartMain';
import {CART_ACTIONS} from '~/components/CartForm';
import {addLine, buildCart, removeLine, updateLine} from '~/lib/cart';
import {commitCart, readCartSession} from '~/lib/cart.server';
import {getDiscount} from '~/data/discounts';

export const meta = () => [{title: 'Tu carrito · MORIAH Café'}];

/** @type {import('react-router').HeadersFunction} */
export const headers = ({actionHeaders}) => actionHeaders;

/** @param {import('react-router').ActionFunctionArgs} args */
export async function action({request}) {
  const formData = await request.formData();
  const cartAction = formData.get('cartAction');
  const {session, lines: current, discountCode: currentCode} = await readCartSession(request);

  let lines = current;
  let discountCode;
  let error = null;

  switch (cartAction) {
    case CART_ACTIONS.ADD:
      lines = addLine(current, {
        handle: String(formData.get('handle') ?? ''),
        size: formData.get('size') ?? undefined,
        grind: formData.get('grind') ?? undefined,
        quantity: Number(formData.get('quantity') ?? 1),
      });
      break;
    case CART_ACTIONS.UPDATE:
      lines = updateLine(
        current,
        String(formData.get('lineId') ?? ''),
        Number(formData.get('quantity') ?? 0),
      );
      break;
    case CART_ACTIONS.REMOVE:
      lines = removeLine(current, String(formData.get('lineId') ?? ''));
      break;
    case CART_ACTIONS.CLEAR:
      lines = [];
      break;
    case CART_ACTIONS.DISCOUNT: {
      const code = String(formData.get('code') ?? '').trim();
      if (!code) {
        discountCode = null;
      } else if (getDiscount(code)) {
        discountCode = getDiscount(code).code;
      } else {
        error = 'Ese código no es válido.';
      }
      break;
    }
    default:
      throw data({error: `Acción de carrito desconocida: ${cartAction}`}, {status: 400});
  }

  const headers = new Headers();
  headers.set('Set-Cookie', await commitCart(session, lines, {discountCode}));

  const redirectTo = formData.get('redirectTo');
  if (typeof redirectTo === 'string' && redirectTo.startsWith('/')) {
    return redirect(redirectTo, {headers});
  }

  const cart = buildCart(lines, {
    discountCode: discountCode === undefined ? currentCode : discountCode,
  });
  return data({cart, error}, {headers});
}

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  const {lines, discountCode} = await readCartSession(request);
  return {cart: buildCart(lines, {discountCode})};
}

export default function Cart() {
  const {cart} = useLoaderData();
  return (
    <div className="cart container">
      <h1 className="display-h2">Tu carrito</h1>
      <CartMain layout="page" cart={cart} />
    </div>
  );
}
