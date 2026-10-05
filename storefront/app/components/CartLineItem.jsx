import {Link} from 'react-router';
import {CART_ACTIONS, CartForm} from '~/components/CartForm';
import {useAside} from '~/components/Aside';
import {SIZES, formatCop} from '~/lib/catalog';

/**
 * Una línea del carrito: imagen, título, opciones, precio y controles de cantidad.
 * @param {{layout: 'page'|'aside', line: import('~/lib/cart').CartLine}} props
 */
export function CartLineItem({layout, line}) {
  const {close} = useAside();
  // Con una sola presentación (250 g) el gramaje no aporta: se oculta.
  const opciones = line.options.filter((o) => !(o.name === 'Gramaje' && SIZES.length === 1));

  return (
    <li className="cart-line">
      <div className="cart-line-inner">
        {line.image && (
          <img
            src={line.image}
            alt={line.title}
            width={100}
            height={100}
            loading="lazy"
            style={{aspectRatio: '1 / 1', objectFit: 'cover'}}
          />
        )}

        <div>
          <Link
            prefetch="intent"
            to={line.url}
            onClick={() => {
              if (layout === 'aside') close();
            }}
          >
            <p>
              <strong>{line.title}</strong>
            </p>
          </Link>
          <div aria-label="Precio" className="product-price" role="group">
            <span>{formatCop(line.totalPrice)}</span>
          </div>
          {opciones.length > 0 && (
            <ul>
              {opciones.map((option) => (
                <li key={option.name}>
                  <small>
                    {option.name}: {option.value}
                  </small>
                </li>
              ))}
            </ul>
          )}
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

/** @param {{line: import('~/lib/cart').CartLine}} props */
function CartLineQuantity({line}) {
  const {id, quantity, isOptimistic} = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  return (
    <div className="cart-line-quantity">
      <div className="cart-line-stepper" role="group" aria-label="Cantidad">
        <CartForm
          action={CART_ACTIONS.UPDATE}
          fetcherKey={`update-${id}`}
          inputs={{lineId: id, quantity: prevQuantity}}
        >
          <button
            aria-label="Reducir cantidad"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            <span>&#8722;</span>
          </button>
        </CartForm>
        <output aria-live="polite">{quantity}</output>
        <CartForm
          action={CART_ACTIONS.UPDATE}
          fetcherKey={`update-${id}`}
          inputs={{lineId: id, quantity: nextQuantity}}
        >
          <button
            aria-label="Aumentar cantidad"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
          >
            <span>&#43;</span>
          </button>
        </CartForm>
      </div>
      <CartForm action={CART_ACTIONS.REMOVE} fetcherKey={`remove-${id}`} inputs={{lineId: id}}>
        <button
          className="cart-line-remove"
          disabled={!!isOptimistic}
          type="submit"
          aria-label="Eliminar del carrito"
        >
          Eliminar
        </button>
      </CartForm>
    </div>
  );
}
