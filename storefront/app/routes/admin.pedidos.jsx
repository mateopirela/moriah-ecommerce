import {and, count, desc, eq, isNotNull, isNull} from 'drizzle-orm';
import {Form, Link, redirect, useActionData, useLoaderData, useNavigation} from 'react-router';
import {getDb} from '~/db/client.server';
import {customers, orders} from '~/db/schema';
import {logoutHeaders, requireAdmin} from '~/lib/admin.server';
import {formatCop} from '~/lib/catalog';
import {shipOrder} from '~/lib/orders.server';
import adminStyles from '~/styles/admin.css?url';

export const links = () => [{rel: 'stylesheet', href: adminStyles}];

export const meta = () => [
  {title: 'Pedidos · MORIAH Admin'},
  {name: 'robots', content: 'noindex, nofollow'},
];

const VIEWS = {
  'por-enviar': {
    label: 'Por enviar',
    where: and(eq(orders.status, 'approved'), isNull(orders.fulfilledAt)),
  },
  enviados: {
    label: 'Enviados',
    where: and(eq(orders.status, 'approved'), isNotNull(orders.fulfilledAt)),
  },
  todos: {label: 'Todos', where: undefined},
};

const TRACKING_MAX = 120;

const STATUS_LABELS = {
  pending: 'Pago pendiente',
  approved: 'Pagado',
  declined: 'Rechazado',
  voided: 'Anulado',
  error: 'Error en el pago',
};

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  await requireAdmin(request);
  const param = new URL(request.url).searchParams.get('ver');
  const view = VIEWS[param] ? param : 'por-enviar';

  const db = await getDb();
  const [rows, [{pending}]] = await Promise.all([
    db
      .select({order: orders, customer: customers})
      .from(orders)
      .leftJoin(customers, eq(orders.customerId, customers.id))
      .where(VIEWS[view].where)
      .orderBy(desc(orders.createdAt))
      .limit(200),
    db.select({pending: count()}).from(orders).where(VIEWS['por-enviar'].where),
  ]);

  return {
    view,
    toShip: pending,
    orders: rows.map(({order, customer}) => ({
      id: order.id,
      reference: order.reference,
      status: order.status,
      subscription: Boolean(order.subscriptionId),
      total: order.amountCents / 100,
      shippingCost: order.shippingCents / 100,
      paymentMethod: order.wompiPaymentMethod,
      items: order.items ?? [],
      shipping: order.shipping ?? {},
      notes: order.notes,
      createdAt: order.createdAt.toISOString(),
      fulfilledAt: order.fulfilledAt?.toISOString() ?? null,
      tracking: order.tracking,
      email: customer?.email ?? null,
    })),
  };
}

/** @param {import('react-router').ActionFunctionArgs} args */
export async function action({request}) {
  const form = await request.formData();
  const intent = form.get('intent');
  if (intent === 'logout') {
    throw redirect('/admin/login', {headers: await logoutHeaders(request)});
  }
  await requireAdmin(request);

  const id = String(form.get('id') ?? '');
  if (id && intent === 'fulfill') {
    const db = await getDb();
    const tracking = String(form.get('tracking') ?? '').trim().slice(0, TRACKING_MAX);
    const {order, emailSent} = await shipOrder(db, id, tracking);
    return {emailFailedRef: order && !emailSent ? order.reference : null};
  }
  if (id && intent === 'unfulfill') {
    const db = await getDb();
    await db
      .update(orders)
      .set({fulfilledAt: null, tracking: null, updatedAt: new Date()})
      .where(eq(orders.id, id));
  }
  return null;
}

const dateFormat = new Intl.DateTimeFormat('es-CO', {
  timeZone: 'America/Bogota',
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** Celular colombiano → enlace de WhatsApp. */
function whatsappUrl(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits.length === 10 ? `57${digits}` : digits}`;
}

export default function AdminOrders() {
  const {view, toShip, orders: list} = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const busyId = navigation.formData?.get('id');

  return (
    <div className="admin container">
      <header className="admin__header">
        <div>
          <span className="eyebrow">MORIAH Admin</span>
          <h1 className="display-h2">Pedidos</h1>
        </div>
        <Form method="post">
          <button className="btn btn--ghost" name="intent" value="logout">
            Salir
          </button>
        </Form>
      </header>

      <nav className="admin__tabs" aria-label="Filtrar pedidos">
        {Object.entries(VIEWS).map(([key, v]) => (
          <Link
            key={key}
            to={`?ver=${key}`}
            className={`admin__tab${view === key ? ' is-active' : ''}`}
            aria-current={view === key ? 'page' : undefined}
          >
            {v.label}
            {key === 'por-enviar' && toShip > 0 ? <span className="admin__count">{toShip}</span> : null}
          </Link>
        ))}
      </nav>

      {/* Arriba de la lista: el pedido recién enviado ya no aparece en "Por enviar". */}
      {actionData?.emailFailedRef ? (
        <p className="admin__warning" role="alert">
          {actionData.emailFailedRef} quedó marcado como enviado, pero el correo al cliente no salió. Avísale
          por WhatsApp.
        </p>
      ) : null}

      {list.length === 0 ? (
        <p className="admin__empty muted">
          {view === 'por-enviar' ? 'No hay pedidos pagados pendientes de envío.' : 'No hay pedidos aquí.'}
        </p>
      ) : (
        <ul className="admin__list">
          {list.map((o) => {
            const s = o.shipping;
            const wa = whatsappUrl(s.phone);
            const busy = busyId === o.id;
            return (
              <li key={o.id} className={`admin-order admin-order--${o.status}`}>
                <div className="admin-order__top">
                  <div>
                    <strong className="admin-order__ref">{o.reference}</strong>
                    <span className="muted"> · {dateFormat.format(new Date(o.createdAt))}</span>
                    {o.subscription ? <span className="admin-badge">Suscripción</span> : null}
                  </div>
                  <span className={`admin-status admin-status--${o.status}`}>
                    {o.status === 'approved' && o.fulfilledAt ? 'Enviado' : STATUS_LABELS[o.status] ?? o.status}
                  </span>
                </div>

                <ul className="admin-order__items">
                  {o.items.map((item, i) => (
                    <li key={i}>
                      <span>
                        {item.quantity} × {item.title}
                        {item.options?.length ? (
                          <span className="muted"> ({item.options.map((op) => op.value).join(' · ')})</span>
                        ) : null}
                      </span>
                      <span>{formatCop(item.totalPrice)}</span>
                    </li>
                  ))}
                  <li className="admin-order__total">
                    <span>
                      Total{o.shippingCost ? <span className="muted"> (envío {formatCop(o.shippingCost)})</span> : null}
                      {o.paymentMethod ? <span className="muted"> · {o.paymentMethod}</span> : null}
                    </span>
                    <strong>{formatCop(o.total)}</strong>
                  </li>
                </ul>

                <div className="admin-order__ship">
                  <p>
                    <strong>{s.name}</strong>
                    <br />
                    {s.address}
                    {s.address2 ? `, ${s.address2}` : ''}
                    <br />
                    {s.city}, {s.region}
                  </p>
                  <p className="admin-order__contact">
                    {s.phone ? <a href={`tel:${s.phone}`}>{s.phone}</a> : null}
                    {wa ? (
                      <a href={wa} target="_blank" rel="noreferrer">
                        WhatsApp
                      </a>
                    ) : null}
                    {o.email ? <a href={`mailto:${o.email}`}>{o.email}</a> : null}
                  </p>
                  {o.notes ? <p className="admin-order__notes">Notas: {o.notes}</p> : null}
                </div>

                {o.status === 'approved' ? (
                  <Form method="post" className="admin-order__actions">
                    <input type="hidden" name="id" value={o.id} />
                    {o.fulfilledAt ? (
                      <>
                        <span className="muted">
                          Enviado el {dateFormat.format(new Date(o.fulfilledAt))}
                          {o.tracking ? ` · Guía: ${o.tracking}` : ''}
                        </span>
                        <button className="btn btn--ghost" name="intent" value="unfulfill" disabled={busy}>
                          Deshacer
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          className="admin-order__tracking"
                          name="tracking"
                          maxLength={TRACKING_MAX}
                          placeholder="Transportadora y guía"
                          aria-label={`Transportadora y número de guía del pedido ${o.reference}`}
                        />
                        <button className="btn" name="intent" value="fulfill" disabled={busy}>
                          {busy ? 'Guardando…' : 'Marcar como enviado'}
                        </button>
                      </>
                    )}
                  </Form>
                ) : null}
                {o.status === 'approved' && !o.fulfilledAt ? (
                  <p className="admin-order__hint muted">Al marcarlo, el cliente recibe un correo con la guía.</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
