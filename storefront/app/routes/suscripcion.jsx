import {useMemo, useState} from 'react';
import {Link, data, redirect, useActionData, useLoaderData, useNavigation, useSubmit} from 'react-router';
import {ShippingFields} from '~/components/ShippingFields';
import {IconCheck, IconShield} from '~/components/Icons';
import {CAFES} from '~/data/cafes';
import {whatsappUrl} from '~/data/contact';
import {getDb} from '~/db/client.server';
import {
  FREQUENCY_DAYS,
  GRINDS,
  SIZES,
  SUBSCRIPTION,
  formatCop,
  frequencyDays,
  getProduct,
  normalizeOptions,
  subscriptionAmounts,
} from '~/lib/catalog';
import {parseShipping, toShippingRecord} from '~/lib/checkout-form';
import {useFocusFirstError} from '~/lib/useFocusFirstError';
import {databaseConfigured, siteUrl} from '~/lib/env.server';
import {upsertCustomer} from '~/lib/orders.server';
import {
  announceSubscription,
  chargeSubscription,
  createSubscription,
} from '~/lib/subscriptions.server';
import {createPaymentSource, getAcceptanceTokens, wompiConfig} from '~/lib/wompi.server';
import {tokenizeCard} from '~/lib/wompi.client';

export const meta = () => [
  {title: 'Club de la Memoria · Suscripción · MORIAH Café'},
  {
    name: 'description',
    content: `Recibe tu café en casa con ${Math.round(
      SUBSCRIPTION.discount * 100,
    )}% de descuento en cada entrega. Pausa o cancela cuando quieras.`,
  },
];

/** Lee y valida la selección (café, gramaje, molienda, frecuencia, cantidad). */
function readSelection(params) {
  const requested = getProduct(params.get('cafe'));
  const product = requested?.subscribable ? requested : getProduct(CAFES[0].handle);
  const {size, grind} = normalizeOptions(product.handle, {
    size: params.get('size'),
    grind: params.get('grind'),
  });
  const freq = frequencyDays(params.get('freq')) ? params.get('freq') : SUBSCRIPTION.defaultFrequency;
  const qty = Math.max(1, Math.min(10, Math.floor(Number(params.get('qty')) || 1)));
  return {cafe: product.handle, size, grind, freq, qty};
}

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  const selection = readSelection(new URL(request.url).searchParams);
  const config = wompiConfig();
  let acceptance = null;
  if (config.configured && databaseConfigured()) {
    acceptance = await getAcceptanceTokens().catch((err) => {
      console.error('[wompi] acceptance tokens', err);
      return null;
    });
  }
  return {
    selection,
    cafes: CAFES.map((c) => ({handle: c.handle, title: c.title, price: c.price, image: c.image})),
    wompi: {publicKey: config.publicKey, configured: config.configured && Boolean(acceptance)},
    acceptance: acceptance
      ? {
          policy: {token: acceptance.acceptance?.acceptance_token, url: acceptance.acceptance?.permalink},
          personalData: {
            token: acceptance.personalData?.acceptance_token,
            url: acceptance.personalData?.permalink,
          },
        }
      : null,
  };
}

/** @param {import('react-router').ActionFunctionArgs} args */
export async function action({request}) {
  if (!wompiConfig().configured || !databaseConfigured()) {
    return data({errors: {general: 'La suscripción en línea no está disponible en este momento.'}}, {status: 503});
  }
  const formData = await request.formData();
  const selection = readSelection(new URLSearchParams(Object.fromEntries(formData)));
  const parsed = parseShipping(formData);
  const errors = parsed.success ? {} : parsed.errors;

  const cardToken = String(formData.get('cardToken') ?? '');
  const acceptanceToken = String(formData.get('acceptanceToken') ?? '');
  const personalAuthToken = String(formData.get('personalAuthToken') ?? '');
  if (!cardToken) errors.card = 'No recibimos los datos de la tarjeta. Inténtalo de nuevo.';
  if (!acceptanceToken || !personalAuthToken) {
    errors.acceptance = 'Debes aceptar los términos y la autorización de datos.';
  }
  if (Object.keys(errors).length) {
    return data({errors, values: parsed.values ?? Object.fromEntries(formData)}, {status: 422});
  }
  const form = parsed.data;

  const db = await getDb();
  const customer = await upsertCustomer(db, {email: form.email, name: form.name, phone: form.phone});

  let source;
  try {
    source = await createPaymentSource({
      token: cardToken,
      customerEmail: customer.email,
      acceptanceToken,
      personalAuthToken,
    });
  } catch (error) {
    console.error('[wompi] createPaymentSource', error);
    return data(
      {errors: {card: 'No pudimos registrar la tarjeta. Verifica los datos o prueba con otra.'}, values: form},
      {status: 422},
    );
  }
  if (source?.status && source.status !== 'AVAILABLE') {
    return data(
      {errors: {card: 'La tarjeta no quedó disponible para cobros recurrentes.'}, values: form},
      {status: 422},
    );
  }

  const {subscription} = await createSubscription(db, {
    customer,
    paymentSource: {
      wompiPaymentSourceId: Number(source.id),
      brand: formData.get('cardBrand') || source.public_data?.brand || null,
      lastFour: formData.get('cardLastFour') || source.public_data?.last_four || null,
      expMonth: formData.get('cardExpMonth') || null,
      expYear: formData.get('cardExpYear') || null,
      status: source.status ?? 'AVAILABLE',
    },
    cafeHandle: selection.cafe,
    sizeLabel: selection.size,
    grind: selection.grind,
    quantity: selection.qty,
    frequencyDays: frequencyDays(selection.freq),
    shipping: toShippingRecord(form),
  });

  const result = await chargeSubscription(db, subscription, {wait: true});
  const manageUrl = `${siteUrl(request)}/suscripcion/gestionar?token=${subscription.manageToken}`;
  await announceSubscription(result.subscription ?? subscription, customer, manageUrl);

  return redirect(`/suscripcion/gracias?token=${subscription.manageToken}`);
}

export default function Subscribe() {
  const {selection: initial, cafes, wompi, acceptance} = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const submit = useSubmit();
  const errors = actionData?.errors ?? {};
  useFocusFirstError(actionData?.errors);

  const [selection, setSelection] = useState(initial);
  // Mientras el cobro en línea no esté activo, el pedido se envía por WhatsApp.
  const cafeElegido = cafes.find((c) => c.handle === selection.cafe);
  const mensajeWhatsapp =
    `Hola MORIAH, quiero suscribirme al Club de la Memoria: ${cafeElegido?.title ?? selection.cafe}, ` +
    `${selection.size}, ${selection.grind}, ${selection.freq}, ` +
    `${selection.qty} ${Number(selection.qty) === 1 ? 'bolsa' : 'bolsas'} por entrega.`;
  const [card, setCard] = useState({number: '', exp: '', cvc: '', holder: ''});
  const [accepted, setAccepted] = useState({policy: false, personalData: false});
  const [cardError, setCardError] = useState(null);
  const [tokenizing, setTokenizing] = useState(false);

  const amounts = useMemo(
    () =>
      subscriptionAmounts({
        cafeHandle: selection.cafe,
        sizeLabel: selection.size,
        quantity: selection.qty,
      }),
    [selection],
  );
  const cafe = cafes.find((c) => c.handle === selection.cafe) ?? cafes[0];
  const busy = tokenizing || navigation.state !== 'idle';

  const update = (patch) => setSelection((s) => ({...s, ...patch}));

  async function onSubmit(event) {
    event.preventDefault();
    setCardError(null);
    if (!accepted.policy || !accepted.personalData) {
      setCardError('Debes aceptar los términos y la autorización de tratamiento de datos.');
      return;
    }
    const [expMonth, expYear] = card.exp.split('/').map((s) => s.trim());
    if (!card.number || !expMonth || !expYear || !card.cvc || !card.holder) {
      setCardError('Completa los datos de la tarjeta.');
      return;
    }
    setTokenizing(true);
    try {
      const token = await tokenizeCard({
        publicKey: wompi.publicKey,
        number: card.number,
        cvc: card.cvc,
        expMonth,
        expYear,
        cardHolder: card.holder,
      });
      const fd = new FormData(event.currentTarget);
      fd.set('cardToken', token.id);
      fd.set('cardBrand', token.brand ?? '');
      fd.set('cardLastFour', token.lastFour ?? '');
      fd.set('cardExpMonth', token.expMonth ?? expMonth);
      fd.set('cardExpYear', token.expYear ?? expYear);
      fd.set('acceptanceToken', acceptance?.policy?.token ?? '');
      fd.set('personalAuthToken', acceptance?.personalData?.token ?? '');
      submit(fd, {method: 'post', replace: true});
    } catch (error) {
      setCardError(error.message);
    } finally {
      setTokenizing(false);
    }
  }

  return (
    <div className="subscribe container">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link to="/collections/club-de-la-memoria">Club de la Memoria</Link> · <span>Suscripción</span>
      </nav>
      <span className="eyebrow">Club de la Memoria</span>
      <h1 className="display-h2">Tu café, en casa, con {Math.round(SUBSCRIPTION.discount * 100)}% menos</h1>
      <p className="lede">
        Elige tu café y la frecuencia. Cobramos hoy la primera entrega y luego con la frecuencia
        que elijas. Pausa o cancela cuando quieras.
      </p>

      {!wompi.configured ? (
        <p className="subscribe__aviso" role="note">
          <strong>El Club se activa por WhatsApp.</strong> Elige tu café y la frecuencia, y envíanos
          tu pedido: te ayudamos a activar tu suscripción.
        </p>
      ) : null}

      <div className="subscribe__grid">
        <form method="post" className="checkout__form" onSubmit={onSubmit} noValidate>
          {(errors.general || cardError) && (
            <p className="form-error" role="alert">
              {errors.general ?? cardError}
            </p>
          )}

          <fieldset className="checkout__group">
            <legend>Tu café</legend>
            <div className="field">
              <label htmlFor="s-cafe">Café</label>
              <select
                id="s-cafe"
                name="cafe"
                value={selection.cafe}
                onChange={(e) => update({cafe: e.target.value})}
              >
                {cafes.map((c) => (
                  <option key={c.handle} value={c.handle}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="s-size">Gramaje</label>
                <select id="s-size" name="size" value={selection.size} onChange={(e) => update({size: e.target.value})}>
                  {SIZES.map((s) => (
                    <option key={s.label} value={s.label}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="s-grind">Molienda</label>
                <select id="s-grind" name="grind" value={selection.grind} onChange={(e) => update({grind: e.target.value})}>
                  {GRINDS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="s-freq">Frecuencia</label>
                <select id="s-freq" name="freq" value={selection.freq} onChange={(e) => update({freq: e.target.value})}>
                  {Object.keys(FREQUENCY_DAYS).map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="s-qty">Bolsas por entrega</label>
                <select id="s-qty" name="qty" value={selection.qty} onChange={(e) => update({qty: Number(e.target.value)})}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {wompi.configured ? (
            <>
            <ShippingFields errors={errors} values={actionData?.values} notesLabel="Notas para la entrega (opcional)" />

            <fieldset className="checkout__group">
              <legend>Tarjeta para los cobros</legend>
              <p className="checkout__pay-note">
                <IconShield width={16} height={16} aria-hidden="true" />
                <span>
                  Los datos de tu tarjeta van directo a <strong>Wompi (Bancolombia)</strong>; nunca
                  pasan por nuestros servidores. Aceptamos Visa y Mastercard.
                </span>
              </p>
              {errors.card && (
                <p className="form-error" role="alert">
                  {errors.card}
                </p>
              )}
              <div className="card-fields">
                <div className="field field--full">
                  <label htmlFor="c-number">Número de tarjeta</label>
                  <input
                    id="c-number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={card.number}
                    onChange={(e) => setCard({...card, number: e.target.value})}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-exp">Vence (MM/AA)</label>
                  <input
                    id="c-exp"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="08/28"
                    value={card.exp}
                    onChange={(e) => setCard({...card, exp: e.target.value})}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-cvc">CVC</label>
                  <input
                    id="c-cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(e) => setCard({...card, cvc: e.target.value})}
                  />
                </div>
                <div className="field field--full">
                  <label htmlFor="c-holder">Nombre en la tarjeta</label>
                  <input
                    id="c-holder"
                    autoComplete="cc-name"
                    value={card.holder}
                    onChange={(e) => setCard({...card, holder: e.target.value})}
                  />
                </div>
              </div>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={accepted.policy}
                  onChange={(e) => setAccepted({...accepted, policy: e.target.checked})}
                />
                <span>
                  Acepto los{' '}
                  <Link to="/policies/terms-of-service">términos del Club</Link> y el{' '}
                  {acceptance?.policy?.url ? (
                    <a href={acceptance.policy.url} target="_blank" rel="noopener noreferrer">
                      reglamento de Wompi
                    </a>
                  ) : (
                    'reglamento de Wompi'
                  )}
                  , y autorizo cobros recurrentes de {formatCop(amounts.total)} {selection.freq.toLowerCase()}.
                </span>
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={accepted.personalData}
                  onChange={(e) => setAccepted({...accepted, personalData: e.target.checked})}
                />
                <span>
                  Autorizo el{' '}
                  {acceptance?.personalData?.url ? (
                    <a href={acceptance.personalData.url} target="_blank" rel="noopener noreferrer">
                      tratamiento de mis datos personales
                    </a>
                  ) : (
                    'tratamiento de mis datos personales'
                  )}{' '}
                  por parte de Wompi y de MORIAH (<Link to="/policies/privacy-policy">política</Link>).
                </span>
              </label>
              {errors.acceptance && (
                <p className="form-error" role="alert">
                  {errors.acceptance}
                </p>
              )}

              <button className="btn btn--lg btn--block" type="submit" disabled={busy || !wompi.configured}>
                {busy ? 'Procesando…' : `Suscribirme · ${formatCop(amounts.total)} hoy`}
              </button>
              {!wompi.configured && (
                <p className="form-error" role="alert">
                  La suscripción en línea no está disponible en este momento. Escríbenos por WhatsApp.
                </p>
              )}
              <noscript>
                <p className="form-error">Necesitas JavaScript activado para suscribirte.</p>
              </noscript>
            </fieldset>
            </>
          ) : (
            <fieldset className="checkout__group">
              <legend>Haz tu pedido</legend>
              <a
                className="btn btn--lg btn--block"
                href={whatsappUrl(mensajeWhatsapp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Suscribirme por WhatsApp
              </a>
              <p className="checkout__pay-note">
                Se abre WhatsApp con tu selección ya escrita. Pausa o cancela cuando quieras.
              </p>
            </fieldset>
          )}
        </form>

        <aside className="checkout__summary" aria-label="Resumen de la suscripción">
          <h2 className="display-h3">Cada entrega</h2>
          <ul className="checkout__lines">
            <li className="checkout__line">
              <img src={cafe.image} alt="" width={56} height={56} />
              <div>
                <p className="checkout__line-title">
                  {selection.qty}× {cafe.title}
                </p>
                <p className="checkout__line-opts">
                  {selection.size} · {selection.grind} · {selection.freq}
                </p>
              </div>
              <span>{formatCop(amounts.subtotal)}</span>
            </li>
          </ul>
          <dl className="checkout__totals">
            <div>
              <dt>Precio de lista</dt>
              <dd>
                <s>{formatCop(cafe.price * selection.qty * (SIZES.find((s) => s.label === selection.size)?.mult ?? 1))}</s>
              </dd>
            </div>
            <div>
              <dt>Descuento Club</dt>
              <dd>−{Math.round(SUBSCRIPTION.discount * 100)}%</dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd>{amounts.shipping === 0 ? 'Gratis' : formatCop(amounts.shipping)}</dd>
            </div>
            <div className="checkout__total">
              <dt>Total por entrega</dt>
              <dd>{formatCop(amounts.total)}</dd>
            </div>
          </dl>
          <ul className="sub-perks" style={{marginTop: '1rem'}}>
            {SUBSCRIPTION.perks.map((p) => (
              <li key={p}>
                <IconCheck width={15} height={15} /> {p}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
