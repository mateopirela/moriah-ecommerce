import {Form, Link, useActionData, useNavigation} from 'react-router';
import {CONTACT, whatsappUrl} from '~/data/contact';
import {useFocusFirstError} from '~/lib/useFocusFirstError';

/**
 * Página de contacto. El formulario envía a la `action` de `pages.$handle.jsx`
 * (React Router) con mejora progresiva: funciona sin JavaScript, valida en el
 * servidor y solo confirma cuando el mensaje quedó registrado de verdad.
 */
export function ContactPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const sending = navigation.state === 'submitting';
  const errors = actionData?.errors ?? {};
  const values = actionData?.values ?? {};
  useFocusFirstError(actionData?.errors);
  const sent = actionData?.ok === true;

  return (
    <div className="tx-page">
      <section className="tx-page-section">
        <div className="tx-contact-grid">
          {/* Formulario */}
          <div>
            <div className="tx-contact-head">
              <h1>Contacto</h1>
              <p className="tx-contact-sub">Escríbenos y nos contactaremos contigo</p>
            </div>

            {sent ? (
              <div className="tx-contact-ok" role="status">
                <p>
                  <strong>Muchas gracias.</strong>
                </p>
                <p>
                  Tu mensaje quedó registrado. Te escribimos a tu correo en las próximas
                  24 horas hábiles.
                </p>
              </div>
            ) : (
              <Form method="post" className="tx-contact-form">
                {errors.general && (
                  <p className="form-error" role="alert">
                    {errors.general}
                  </p>
                )}

                <div className={`field${errors.name ? ' field--error' : ''}`}>
                  <label htmlFor="c-name">Nombre</label>
                  <input
                    id="c-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={120}
                    defaultValue={values.name ?? ''}
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'err-name' : undefined}
                  />
                  {errors.name && (
                    <p className="field__error" id="err-name" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className={`field${errors.email ? ' field--error' : ''}`}>
                  <label htmlFor="c-email">Correo electrónico</label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={200}
                    defaultValue={values.email ?? ''}
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'err-email' : undefined}
                  />
                  {errors.email && (
                    <p className="field__error" id="err-email" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="c-phone">
                    Teléfono / WhatsApp <span className="field__optional">(opcional)</span>
                  </label>
                  <input
                    id="c-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={40}
                    defaultValue={values.phone ?? ''}
                  />
                </div>

                <div className={`field${errors.message ? ' field--error' : ''}`}>
                  <label htmlFor="c-message">Mensaje</label>
                  <textarea
                    id="c-message"
                    name="message"
                    rows={5}
                    required
                    maxLength={5000}
                    defaultValue={values.message ?? ''}
                    placeholder="¿En qué te podemos ayudar? Pedidos, mayoreo, cafeterías…"
                    aria-invalid={errors.message ? 'true' : undefined}
                    aria-describedby={errors.message ? 'err-message' : undefined}
                  />
                  {errors.message && (
                    <p className="field__error" id="err-message" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className={`field${errors.consent ? ' field--error' : ''}`}>
                  <label className="checkbox" htmlFor="c-consent">
                    <input id="c-consent" type="checkbox" name="consent" required />
                    <span>
                      Acepto las{' '}
                      <Link to="/policies/privacy-policy">políticas de datos personales</Link>.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="field__error" role="alert">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <button type="submit" className="btn" disabled={sending}>
                  {sending ? 'Enviando…' : 'Enviar mensaje'}
                </button>

                <p className="tx-contact-alt">
                  ¿Prefieres escribirnos directo?{' '}
                  {CONTACT.hasWhatsapp ? (
                    <a href={whatsappUrl('Hola MORIAH, tengo una pregunta.')} rel="noopener noreferrer" target="_blank">
                      Escríbenos por WhatsApp
                    </a>
                  ) : (
                    <a href={CONTACT.emailHref}>{CONTACT.email}</a>
                  )}
                </p>
              </Form>
            )}
          </div>

          {/* Foto */}
          <div className="tx-contact-photo">
            <img
              src="/images/monte-moriah.webp"
              alt="Montañas cafeteras de Colombia al amanecer"
              width={1200}
              height={1600}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
