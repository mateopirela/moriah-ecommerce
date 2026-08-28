import {useEffect} from 'react';
import {Link, useLoaderData, useRevalidator} from 'react-router';
import {desc, eq} from 'drizzle-orm';
import {IconArrowRight, IconCheck} from '~/components/Icons';
import {orders} from '~/db/schema';
import {getDb} from '~/db/client.server';
import {formatCop, getProduct} from '~/lib/catalog';
import {findByManageToken, frequencyLabel} from '~/lib/subscriptions.server';

export const meta = () => [{title: 'Bienvenido al Club · MORIAH Café'}, {name: 'robots', content: 'noindex'}];

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  const token = new URL(request.url).searchParams.get('token');
  const db = await getDb();
  const sub = await findByManageToken(db, token);
  if (!sub) throw new Response('Suscripción no encontrada', {status: 404});
  const [lastOrder] = await db
    .select()
    .from(orders)
    .where(eq(orders.subscriptionId, sub.id))
    .orderBy(desc(orders.createdAt))
    .limit(1);
  const product = getProduct(sub.cafeHandle);
  return {
    subscription: {
      status: sub.status,
      cafeTitle: product?.title ?? sub.cafeHandle,
      image: product?.image,
      sizeLabel: sub.sizeLabel,
      grind: sub.grind,
      quantity: sub.quantity,
      frequency: frequencyLabel(sub.frequencyDays),
      amountCents: sub.amountCents,
      nextChargeAt: sub.nextChargeAt,
      manageToken: sub.manageToken,
    },
    order: lastOrder ? {status: lastOrder.status, reference: lastOrder.reference} : null,
  };
}

export default function SubscriptionThanks() {
  const {subscription, order} = useLoaderData();
  const revalidator = useRevalidator();
  const paymentStatus = order?.status ?? 'pending';

  useEffect(() => {
    if (paymentStatus !== 'pending') return undefined;
    const t = setInterval(() => revalidator.revalidate(), 5000);
    return () => clearInterval(t);
  }, [paymentStatus, revalidator]);

  const ok = paymentStatus === 'approved';
  const failed = ['declined', 'error', 'voided'].includes(paymentStatus);
  const manageHref = `/suscripcion/gestionar?token=${subscription.manageToken}`;

  return (
    <div className="status-page container">
      <section className={`status-card status-card--${ok ? 'approved' : failed ? 'declined' : 'pending'}`}>
        <div className="status-card__icon" aria-hidden="true">
          {ok ? <IconCheck width={40} height={40} /> : failed ? '✕' : '⏳'}
        </div>
        <span className="eyebrow">Club de la Memoria</span>
        <h1 className="display-h2">
          {ok
            ? '¡Bienvenido al Club!'
            : failed
              ? 'No pudimos realizar el primer cobro'
              : 'Estamos confirmando tu primer cobro'}
        </h1>
        <p className="lede">
          {ok
            ? 'Tu primera entrega ya está en marcha. Guarda este enlace para gestionar tu suscripción cuando quieras.'
            : failed
              ? 'Tu banco rechazó la transacción. Tu suscripción quedó creada pero sin cobros; puedes intentar con otra tarjeta desde el enlace de gestión.'
              : 'Wompi está procesando el cobro. Esta página se actualiza sola.'}
        </p>

        <dl className="status-card__summary">
          <div>
            <dt>
              {subscription.quantity}× {subscription.cafeTitle} ({subscription.sizeLabel}, {subscription.grind})
            </dt>
            <dd>{formatCop(subscription.amountCents / 100)}</dd>
          </div>
          <div>
            <dt>Frecuencia</dt>
            <dd>{subscription.frequency}</dd>
          </div>
          {ok && (
            <div>
              <dt>Próximo cobro</dt>
              <dd>{new Date(subscription.nextChargeAt).toLocaleDateString('es-CO', {dateStyle: 'long'})}</dd>
            </div>
          )}
          {order && (
            <div>
              <dt>Referencia</dt>
              <dd>{order.reference}</dd>
            </div>
          )}
        </dl>

        <div className="status-card__actions">
          <Link className="btn btn--lg" to={manageHref}>
            Gestionar mi suscripción
            <IconArrowRight className="btn-icon" />
          </Link>
          <Link className="btn btn--ghost" to="/collections/cafes">
            Seguir explorando
          </Link>
        </div>
      </section>
    </div>
  );
}
