import {Form, Link, data, redirect, useActionData, useLoaderData, useNavigation} from 'react-router';
import {ShippingFields} from '~/components/ShippingFields';
import {IconShield} from '~/components/Icons';
import {loadCart} from '~/lib/cart.server';
import {formatCop, toCents} from '~/lib/catalog';
import {parseShipping, toShippingRecord} from '~/lib/checkout-form';
import {useFocusFirstError} from '~/lib/useFocusFirstError';
import {getDb} from '~/db/client.server';
import {databaseConfigured, siteUrl} from '~/lib/env.server';
import {createOrder, orderItemsFromCart, upsertCustomer} from '~/lib/orders.server';
import {buildCheckoutUrl, wompiConfig} from '~/lib/wompi.server';

export const meta = () => [{title: 'Finalizar compra · MORIAH Café'}];

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  const cart = await loadCart(request);
  if (cart.lines.length === 0) throw redirect('/cart');
  return {cart, paymentsEnabled: wompiConfig().configured && databaseConfigured()};
}

/** @param {import('react-router').ActionFunctionArgs} args */
export async function action({request}) {
  const cart = await loadCart(request);
  if (cart.lines.length === 0) return redirect('/cart');
  if (!wompiConfig().configured || !databaseConfigured()) {
    return data({errors: {general: 'El pago en línea no está disponible en este momento.'}}, {status: 503});
  }

  const parsed = parseShipping(await request.formData());
  if (!parsed.success) {
    return data({errors: parsed.errors, values: parsed.values}, {status: 422});
  }
  const form = parsed.data;

  const db = await getDb();
  const customer = await upsertCustomer(db, {
    email: form.email,
    name: form.name,
    phone: form.phone,
  });
  const notes = [form.notes, cart.discount ? `Código: ${cart.discount.code}` : null]
    .filter(Boolean)
    .join(' · ');
  const order = await createOrder(db, {
    customerId: customer.id,
    items: orderItemsFromCart(cart),
    amountCents: toCents(cart.total),
    shippingCents: toCents(cart.shipping),
    shipping: toShippingRecord(form),
    notes: notes || null,
  });

  const checkoutUrl = buildCheckoutUrl({
    reference: order.reference,
    amountInCents: order.amountCents,
    currency: 'COP',
    redirectUrl: `${siteUrl(request)}/checkout/gracias?ref=${encodeURIComponent(order.reference)}`,
    customer: {email: customer.email, fullName: customer.name, phone: customer.phone ?? undefined},
    shipping: {
      addressLine1: form.address,
      addressLine2: form.address2 || undefined,
      city: form.city,
      region: form.region,
      country: 'CO',
      name: form.name,
      phone: form.phone,
    },
  });

  return redirect(checkoutUrl);
}

export default function Checkout() {
  const {cart, paymentsEnabled} = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state !== 'idle';
  const errors = actionData?.errors ?? {};
  const errorCount = Object.keys(errors).length;
  useFocusFirstError(actionData?.errors);

  return (
    <div className="checkout container">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link to="/cart">Carrito</Link> · <span>Finalizar compra</span>
      </nav>
      <h1 className="display-h2">Finalizar compra</h1>

      <div className="checkout__grid">
        <Form method="post" className="checkout__form" replace>
          {errorCount > 0 && (
            <div className="form-errors" role="alert">
              <p>
                {errors.general
                  ? errors.general
                  : `Revisa ${errorCount === 1 ? 'este dato' : `estos ${errorCount} datos`} para continuar con el pago:`}
              </p>
              {!errors.general && (
                <ul>
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>
                      <a href={`#f-${field}`}>{message}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <ShippingFields errors={errors} values={actionData?.values} />

          <fieldset className="checkout__group">
            <legend>Pago</legend>
            <p className="checkout__pay-note">
              <IconShield width={16} height={16} aria-hidden="true" />
              <span>
                Al continuar te llevamos al checkout seguro de{' '}
                <strong>Wompi (Bancolombia)</strong>: Nequi, PSE, tarjetas débito y crédito.
                Volverás aquí al terminar.
              </span>
            </p>
            <button
              className="btn btn--lg btn--block"
              type="submit"
              disabled={submitting || !paymentsEnabled}
            >
              {submitting ? 'Preparando tu pago…' : `Pagar ${formatCop(cart.total)} con Wompi`}
            </button>
            {!paymentsEnabled && (
              <p className="form-error" role="alert">
                El pago en línea no está disponible en este momento. Escríbenos por WhatsApp para
                completar tu pedido.
              </p>
            )}
            <p className="checkout__legal">
              Al pagar aceptas nuestros{' '}
              <Link to="/policies/terms-of-service">términos y condiciones</Link> y la{' '}
              <Link to="/policies/privacy-policy">política de datos personales</Link>.
            </p>
          </fieldset>
        </Form>

        <aside className="checkout__summary" aria-label="Resumen del pedido">
          <h2 className="display-h3">Tu pedido</h2>
          <ul className="checkout__lines">
            {cart.lines.map((line) => (
              <li key={line.id} className="checkout__line">
                <img src={line.image} alt="" width={56} height={56} />
                <div>
                  <p className="checkout__line-title">
                    {line.quantity}× {line.title}
                  </p>
                  {line.options.length > 0 && (
                    <p className="checkout__line-opts">
                      {line.options.map((o) => o.value).join(' · ')}
                    </p>
                  )}
                </div>
                <span>{formatCop(line.totalPrice)}</span>
              </li>
            ))}
          </ul>
          <dl className="checkout__totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCop(cart.subtotal)}</dd>
            </div>
            {cart.discount && (
              <div>
                <dt>Descuento ({cart.discount.code})</dt>
                <dd>−{formatCop(cart.discount.amount)}</dd>
              </div>
            )}
            <div>
              <dt>Envío</dt>
              <dd>{cart.shipping === 0 ? 'Gratis' : formatCop(cart.shipping)}</dd>
            </div>
            <div className="checkout__total">
              <dt>Total</dt>
              <dd>{formatCop(cart.total)}</dd>
            </div>
          </dl>
          <Link to="/cart" className="checkout__edit">
            Editar carrito
          </Link>
        </aside>
      </div>
    </div>
  );
}
