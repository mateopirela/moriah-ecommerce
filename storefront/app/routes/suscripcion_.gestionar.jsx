import {Form, Link, data, useActionData, useLoaderData, useNavigation} from 'react-router';
import {desc, eq} from 'drizzle-orm';
import {customers, orders, subscriptions} from '~/db/schema';
import {getDb} from '~/db/client.server';
import {FREQUENCY_DAYS, formatCop, getProduct} from '~/lib/catalog';
import {siteUrl} from '~/lib/env.server';
import {getKlaviyo} from '~/lib/klaviyo.server';
import {findByManageToken, frequencyLabel, manageSubscription} from '~/lib/subscriptions.server';

export const meta = () => [{title: 'Gestionar mi suscripción · MORIAH Café'}, {name: 'robots', content: 'noindex'}];

const STATUS_LABEL = {
  active: 'Activa',
  paused: 'En pausa',
  past_due: 'Pago pendiente',
  cancelled: 'Cancelada',
};

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) return {subscription: null};
  const db = await getDb();
  const sub = await findByManageToken(db, token);
  if (!sub) throw new Response('Enlace no válido', {status: 404});
  const [customer] = await db.select().from(customers).where(eq(customers.id, sub.customerId)).limit(1);
  const history = await db
    .select()
    .from(orders)
    .where(eq(orders.subscriptionId, sub.id))
    .orderBy(desc(orders.createdAt))
    .limit(6);
  const product = getProduct(sub.cafeHandle);
  return {
    subscription: {
      token,
      status: sub.status,
      cafeTitle: product?.title ?? sub.cafeHandle,
      sizeLabel: sub.sizeLabel,
      grind: sub.grind,
      quantity: sub.quantity,
      frequencyDays: sub.frequencyDays,
      frequency: frequencyLabel(sub.frequencyDays),
      amountCents: sub.amountCents,
      nextChargeAt: sub.nextChargeAt,
      shipping: sub.shipping,
      email: customer?.email,
      history: history.map((o) => ({
        reference: o.reference,
        status: o.status,
        amountCents: o.amountCents,
        createdAt: o.createdAt,
      })),
    },
  };
}

/** @param {import('react-router').ActionFunctionArgs} args */
export async function action({request}) {
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');
  const db = await getDb();

  if (intent === 'resend') {
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    if (email) {
      const [customer] = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
      if (customer) {
        const subs = await db.select().from(subscriptions).where(eq(subscriptions.customerId, customer.id));
        const links = subs.map((s) => `${siteUrl(request)}/suscripcion/gestionar?token=${s.manageToken}`);
        if (links.length) {
          await getKlaviyo()
            .trackEvent({
              metric: {name: 'Subscription Manage Link Requested'},
              profile: {email: customer.email, first_name: customer.name},
              properties: {links},
            })
            .catch(() => {});
        }
      }
    }
    return data({resent: true});
  }

  const token = String(formData.get('token') ?? '');
  const sub = await findByManageToken(db, token);
  if (!sub) return data({error: 'Enlace no válido.'}, {status: 404});

  const updated = await manageSubscription(db, sub, intent, {
    frequencyDays: Number(formData.get('frequencyDays')) || undefined,
  });
  return data({ok: true, status: updated.status});
}

export default function ManageSubscription() {
  const {subscription} = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const busy = navigation.state !== 'idle';

  if (!subscription) {
    return (
      <div className="status-page container">
        <section className="manage-card">
          <span className="eyebrow">Club de la Memoria</span>
          <h1 className="display-h2">Gestionar mi suscripción</h1>
          <p className="lede">
            Usa el enlace que recibiste por correo al suscribirte. Si no lo tienes, escribe tu correo
            y te lo reenviamos.
          </p>
          {actionData?.resent ? (
            <p className="form-success-text">
              Si existe una suscripción con ese correo, te enviamos el enlace. Revisa también la
              carpeta de spam.
            </p>
          ) : (
            <Form method="post" className="checkout__form">
              <input type="hidden" name="intent" value="resend" />
              <div className="field">
                <label htmlFor="m-email">Correo</label>
                <input id="m-email" name="email" type="email" required autoComplete="email" />
              </div>
              <button className="btn" type="submit" disabled={busy}>
                Reenviar enlace
              </button>
            </Form>
          )}
        </section>
      </div>
    );
  }

  const s = subscription;
  const cancelled = s.status === 'cancelled';

  return (
    <div className="status-page container">
      <section className="manage-card">
        <span className="eyebrow">Club de la Memoria</span>
        <h1 className="display-h2">
          Tu suscripción{' '}
          <span className={`status-pill status-pill--${s.status}`}>{STATUS_LABEL[s.status] ?? s.status}</span>
        </h1>
        {actionData?.error && (
          <p className="form-error" role="alert">
            {actionData.error}
          </p>
        )}
        {actionData?.ok && <p className="form-success-text">Listo, actualizamos tu suscripción.</p>}

        <dl>
          <dt>Café</dt>
          <dd>
            {s.quantity}× {s.cafeTitle} · {s.sizeLabel} · {s.grind}
          </dd>
          <dt>Frecuencia</dt>
          <dd>{s.frequency}</dd>
          <dt>Cobro por entrega</dt>
          <dd>{formatCop(s.amountCents / 100)}</dd>
          {!cancelled && (
            <>
              <dt>{s.status === 'paused' ? 'Reanudar cobra el' : 'Próximo cobro'}</dt>
              <dd>{new Date(s.nextChargeAt).toLocaleDateString('es-CO', {dateStyle: 'long'})}</dd>
            </>
          )}
          <dt>Entrega</dt>
          <dd>
            {s.shipping.name} · {s.shipping.address}
            {s.shipping.address2 ? `, ${s.shipping.address2}` : ''} · {s.shipping.city}, {s.shipping.region}
          </dd>
          <dt>Correo</dt>
          <dd>{s.email}</dd>
        </dl>

        {s.status === 'past_due' && (
          <p className="form-error">
            Los últimos cobros fueron rechazados. Para reactivar la suscripción con otra tarjeta,
            cancela esta y crea una nueva desde <Link to="/suscripcion">el Club</Link>; tu historial se conserva.
          </p>
        )}

        {!cancelled && (
          <>
            <Form method="post" className="manage-card__actions">
              <input type="hidden" name="token" value={s.token} />
              {s.status === 'paused' ? (
                <button className="btn" name="intent" value="resume" disabled={busy}>
                  Reanudar
                </button>
              ) : (
                <button className="btn btn--ghost" name="intent" value="pause" disabled={busy}>
                  Pausar
                </button>
              )}
              <button
                className="btn btn--ghost"
                name="intent"
                value="cancel"
                disabled={busy}
                onClick={(e) => {
                  if (!window.confirm('¿Seguro que quieres cancelar tu suscripción?')) e.preventDefault();
                }}
              >
                Cancelar suscripción
              </button>
            </Form>

            <Form method="post" className="checkout__form" style={{marginTop: '1.5rem'}}>
              <input type="hidden" name="token" value={s.token} />
              <input type="hidden" name="intent" value="frequency" />
              <div className="field">
                <label htmlFor="m-freq">Cambiar frecuencia</label>
                <select id="m-freq" name="frequencyDays" defaultValue={s.frequencyDays}>
                  {Object.entries(FREQUENCY_DAYS).map(([label, days]) => (
                    <option key={days} value={days}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn--ghost" type="submit" disabled={busy}>
                Guardar frecuencia
              </button>
            </Form>
          </>
        )}

        {s.history.length > 0 && (
          <>
            <h2 className="display-h3" style={{marginTop: '2rem'}}>
              Historial de cobros
            </h2>
            <dl>
              {s.history.map((o) => (
                <div key={o.reference} style={{display: 'contents'}}>
                  <dt>{new Date(o.createdAt).toLocaleDateString('es-CO')}</dt>
                  <dd>
                    {formatCop(o.amountCents / 100)} · {o.status} · {o.reference}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </section>
    </div>
  );
}
