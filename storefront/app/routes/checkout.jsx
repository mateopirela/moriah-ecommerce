import {useState} from 'react';
import {Form, Link, data, redirect, useActionData, useLoaderData, useNavigation} from 'react-router';
import {ShippingFields} from '~/components/ShippingFields';
import {IconShield} from '~/components/Icons';
import {loadCart} from '~/lib/cart.server';
import {LOCAL_SHIPPING_FEE, SHIPPING_FEE, formatCop, isLocalCity, toCents} from '~/lib/catalog';
import {withShipping} from '~/lib/cart';
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
  // El envío depende de la ciudad: se recalcula aquí, en el servidor, con la ciudad enviada.
  const priced = withShipping(cart, form.city);

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
    amountCents: toCents(priced.total),
    shippingCents: toCents(priced.shipping),
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

/** Resumen del pedido (se usa en el panel de escritorio y en el desplegable de móvil). */
function ResumenPedido({cart, city}) {
  return (
    <>
      <h2 className="co__resumen-titulo">Tu pedido</h2>
      <ul className="checkout__lines">
        {cart.lines.map((line) => (
          <li key={line.id} className="checkout__line">
            <span className="co__thumb">
              <img src={line.image} alt="" width={56} height={56} />
              <span className="co__cant" aria-hidden="true">
                {line.quantity}
              </span>
            </span>
            <div>
              <p className="checkout__line-title">
                <span className="sr-only">{line.quantity}× </span>
                {line.title}
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
          <dd>
            {cart.shippingPending
              ? 'Escribe tu ciudad'
              : cart.shipping === 0
                ? 'Gratis'
                : formatCop(cart.shipping)}
          </dd>
        </div>
        <div className="checkout__total">
          <dt>{cart.shippingPending ? 'Total sin envío' : 'Total'}</dt>
          <dd>{formatCop(cart.shippingPending ? cart.total - cart.shipping : cart.total)}</dd>
        </div>
      </dl>
      <p className="checkout__envio-nota">
        {cart.shippingPending
          ? `Envío: Barranquilla ${formatCop(LOCAL_SHIPPING_FEE)} · resto del país ${formatCop(SHIPPING_FEE)}.`
          : cart.shipping > 0 && isLocalCity(city)
            ? 'Tarifa local de Barranquilla.'
            : null}
      </p>
      <Link to="/cart" className="checkout__edit">
        Editar carrito
      </Link>
    </>
  );
}

export default function Checkout() {
  const {cart: baseCart, paymentsEnabled} = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submitting = navigation.state !== 'idle';
  const errors = actionData?.errors ?? {};
  const errorCount = Object.keys(errors).length;
  useFocusFirstError(actionData?.errors);
  // La ciudad define el envío: el resumen se actualiza mientras se escribe.
  const [city, setCity] = useState(actionData?.values?.city ?? '');
  const cart = withShipping(baseCart, city);
  const totalVisible = formatCop(cart.shippingPending ? cart.total - cart.shipping : cart.total);

  return (
    <div className="co">
      <div className="co__main">
        <header className="co__cabecera">
          <Link to="/cart" className="co__volver">
            <span aria-hidden="true">←</span> Volver<span className="co__volver-resto"> al carrito</span>
          </Link>
          <Link to="/" className="co__logo" aria-label="MORIAH Café, ir al inicio">
            <img src="/images/logo-moriah.png" alt="" width={34} height={34} />
            <span>MORIAH</span>
          </Link>
          <span className="co__cabecera-espacio" aria-hidden="true" />
        </header>

        <ol className="co__pasos" aria-label="Pasos de la compra">
          <li>
            <Link to="/cart">Carrito</Link>
          </li>
          <li aria-current="step">Datos y envío</li>
          <li>Pago</li>
        </ol>

        <h1 className="co__titulo">Finalizar compra</h1>

        {/* Móvil: el resumen va colapsado arriba, con el total a la vista. */}
        <details className="co__movil">
          <summary>
            <span>Mostrar resumen del pedido</span>
            <strong>{totalVisible}</strong>
          </summary>
          <div className="co__movil-cuerpo">
            <ResumenPedido cart={cart} city={city} />
          </div>
        </details>

        <Form
          method="post"
          className="checkout__form co__form"
          replace
          onInput={(e) => {
            if (e.target.name === 'city') setCity(e.target.value);
          }}
        >
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
          <ShippingFields
            flotante
            errors={errors}
            values={actionData?.values}
            contactLegend="Contacto"
            addressLegend="Entrega"
            notesLabel="Notas para tu pedido (opcional)"
          />

          <fieldset className="checkout__group">
            <legend>Pago</legend>
            <p className="checkout__pay-note">
              <IconShield width={16} height={16} aria-hidden="true" />
              <span>
                Pagas en el sitio seguro de <strong>Wompi</strong>. No guardamos los datos de tu
                tarjeta.
              </span>
            </p>
            <button
              className="co__pagar"
              type="submit"
              disabled={submitting || !paymentsEnabled}
            >
              {submitting
                ? 'Preparando tu pago…'
                : cart.shippingPending
                  ? 'Pagar con Wompi'
                  : `Pagar ${formatCop(cart.total)} con Wompi`}
            </button>
            <ul className="co__metodos" aria-label="Medios de pago">
              <li>Nequi</li>
              <li>PSE</li>
              <li>Tarjeta débito</li>
              <li>Tarjeta crédito</li>
            </ul>
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
      </div>

      <aside className="co__panel" aria-label="Resumen del pedido">
        <div className="co__panel-fijo">
          <ResumenPedido cart={cart} city={city} />
        </div>
      </aside>
    </div>
  );
}
