import {useState} from 'react';

export function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);

    fetch('/contact#contact_form', {
      method: 'POST',
      body: data,
    })
      .then(() => setSent(true))
      .catch(() => setSent(true));
  }

  return (
    <div className="tx-page">
      <section className="tx-page-section">
        <div className="tx-contact-grid">
          {/* Formulario */}
          <div>
            <div className="tx-contact-head">
              <h1>Contacto</h1>
              <span className="tx-titulo">Escríbenos y nos contactaremos contigo</span>
            </div>

            {sent ? (
              <div style={{padding:'2rem', background:'var(--tx-surface)', borderRadius:'10px'}}>
                <p className="tx-lede" style={{color:'var(--tx-ink)'}}>
                  <strong>Muchas gracias.</strong><br />
                  Tu mensaje ha sido recibido. Te escribiremos pronto.
                </p>
              </div>
            ) : (
              <form
                className="tx-contact-form"
                method="post"
                action="/contact#contact_form"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form_type" value="contact" />
                <input type="hidden" name="utf8" value="✓" />

                <input
                  className="tx-form-field"
                  name="contact[name]"
                  type="text"
                  placeholder="Nombre"
                  required
                  maxLength={256}
                />
                <input
                  className="tx-form-field"
                  name="contact[phone]"
                  type="tel"
                  placeholder="Teléfono"
                  maxLength={256}
                />
                <input
                  className="tx-form-field"
                  name="contact[email]"
                  type="email"
                  placeholder="Correo electrónico"
                  required
                  maxLength={256}
                />
                <textarea
                  className="tx-form-field tx-form-field--textarea"
                  name="contact[message]"
                  placeholder="Mensaje"
                  required
                  maxLength={5000}
                />
                <label className="tx-form-check">
                  <input type="checkbox" name="contact[acepto_politicas]" required />
                  <span>
                    Acepto las{' '}
                    <a href="/policies/privacy-policy" style={{color:'var(--tx-gold)'}}>
                      políticas de datos personales
                    </a>
                    .
                  </span>
                </label>

                <button type="submit" className="tx-btn" style={{alignSelf:'flex-start'}}>
                  Enviar
                </button>
              </form>
            )}
          </div>

          {/* Foto */}
          <div className="tx-contact-photo">
            <img
              src="/images/monte-moriah.webp"
              alt="MORIAH Café — Colombia"
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
