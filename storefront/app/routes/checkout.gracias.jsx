import {useEffect} from 'react';
import {Link, data, useLoaderData, useRevalidator} from 'react-router';
import {IconArrowRight, IconCheck} from '~/components/Icons';
import {getDb} from '~/db/client.server';
import {clearCartCookie} from '~/lib/cart.server';
import {formatCop} from '~/lib/catalog';
import {findOrderByReference, syncOrderWithTransaction} from '~/lib/orders.server';
import {analytics} from '~/lib/analytics';

export const meta = () => [{title: 'Tu pedido · MORIAH Café'}, {name: 'robots', content: 'noindex'}];

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  const url = new URL(request.url);
  const reference = url.searchParams.get('ref');
  const transactionId = url.searchParams.get('id');
  const db = await getDb();

  let order;
  if (transactionId) {
    const result = await syncOrderWithTransaction(db, {reference, transactionId});
    order = result.order;
  } else {
    order = await findOrderByReference(db, reference);
  }
  if (!order) throw new Response('Pedido no encontrado', {status: 404});

  const headers = new Headers();
  if (order.status === 'approved') {
    headers.set('Set-Cookie', await clearCartCookie(request));
  }

  return data(
    {
      order: {
        reference: order.reference,
        status: order.status,
        amountCents: order.amountCents,
        shippingCents: order.shippingCents,
        items: order.items,
        shipping: order.shipping,
        paymentMethod: order.wompiPaymentMethod,
      },
    },
    {headers},
  );
}

export default function CheckoutThanks() {
  const {order} = useLoaderData();
  const revalidator = useRevalidator();

  useEffect(() => {
    if (order.status === 'approved') analytics.purchase(order);
  }, [order]);

  // Mientras Wompi confirma el pago, refrescamos cada 5 s.
  useEffect(() => {
    if (order.status !== 'pending') return undefined;
    const t = setInterval(() => revalidator.revalidate(), 5000);
    return () => clearInterval(t);
  }, [order.status, revalidator]);

  const copy = STATUS_COPY[order.status] ?? STATUS_COPY.error;

  return (
    <div className="status-page container">
      <section className={`status-card status-card--${order.status}`}>
        <div className="status-card__icon" aria-hidden="true">
          {order.status === 'approved' ? <IconCheck width={40} height={40} /> : copy.icon}
        </div>
        <span className="eyebrow">Pedido {order.reference}</span>
        <h1 className="display-h2">{copy.title}</h1>
        <p className="lede">{copy.body}</p>

        <dl className="status-card__summary">
          {order.items.map((item, i) => (
            <div key={i}>
              <dt>
                {item.quantity}× {item.title}
                {item.options?.length ? ` (${item.options.map((o) => o.value).join(', ')})` : ''}
              </dt>
              <dd>{formatCop(item.totalPrice)}</dd>
            </div>
          ))}
          <div>
            <dt>Envío</dt>
            <dd>{order.shippingCents === 0 ? 'Gratis' : formatCop(order.shippingCents / 100)}</dd>
          </div>
          <div className="status-card__total">
            <dt>Total</dt>
            <dd>{formatCop(order.amountCents / 100)}</dd>
          </div>
        </dl>

        <p className="muted">
          Entrega a {order.shipping.name} · {order.shipping.address}
          {order.shipping.address2 ? `, ${order.shipping.address2}` : ''} · {order.shipping.city},{' '}
          {order.shipping.region}
        </p>

        <div className="status-card__actions">
          {order.status === 'pending' ? (
            <button className="btn btn--ghost" onClick={() => revalidator.revalidate()}>
              Actualizar estado
            </button>
          ) : order.status === 'approved' ? (
            <Link className="btn btn--lg" to="/collections/cafes">
              Seguir explorando
              <IconArrowRight className="btn-icon" />
            </Link>
          ) : (
            <Link className="btn btn--lg" to="/checkout">
              Intentar de nuevo
              <IconArrowRight className="btn-icon" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

const STATUS_COPY = {
  approved: {
    title: '¡Gracias! Tu café ya está en camino de ser tostado.',
    body: 'Recibimos tu pago. Te enviaremos la confirmación y la guía de envío a tu correo.',
  },
  pending: {
    icon: '⏳',
    title: 'Estamos confirmando tu pago',
    body: 'Wompi está procesando la transacción. Esta página se actualiza sola; también te avisaremos por correo cuando se confirme.',
  },
  declined: {
    icon: '✕',
    title: 'El pago no fue aprobado',
    body: 'Tu banco rechazó la transacción. No se realizó ningún cobro. Puedes intentar con otro medio de pago.',
  },
  voided: {
    icon: '↩',
    title: 'El pago fue anulado',
    body: 'La transacción se anuló y no se realizó ningún cobro.',
  },
  error: {
    icon: '!',
    title: 'Hubo un problema con el pago',
    body: 'No pudimos completar la transacción. Si el cobro aparece en tu banco, escríbenos y lo resolvemos.',
  },
};
