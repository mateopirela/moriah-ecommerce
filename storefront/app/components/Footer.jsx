import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {
  IconInstagram,
  IconWhatsapp,
  IconFacebook,
  IconArrowRight,
} from '~/components/Icons';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise}) {
  const year = 2025;
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {() => (
          <footer className="footer">
            <div className="container footer__grid">
              <div className="footer__brand">
                <img
                  src="/images/logo-moriah.png"
                  alt="MORIAH Café"
                  width={64}
                  height={64}
                />
                <p className="footer__tagline">
                  Café 100% colombiano de especialidad. En cada grano, una
                  promesa. En cada taza, provisión.
                </p>
                <div className="footer__social">
                  <a
                    href="https://instagram.com"
                    aria-label="Instagram"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <IconInstagram />
                  </a>
                  <a
                    href="https://wa.me/57"
                    aria-label="WhatsApp"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <IconWhatsapp />
                  </a>
                  <a
                    href="https://facebook.com"
                    aria-label="Facebook"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <IconFacebook />
                  </a>
                </div>
              </div>

              <div className="footer__col">
                <h4>Tienda</h4>
                <nav className="footer__links" aria-label="Tienda">
                  <Link to="/collections/cafes">Todos los cafés</Link>
                  <Link to="/collections/all">Ediciones de especialidad</Link>
                  <Link to="/#proceso">Nuestro proceso</Link>
                  <Link to="/#envios">Envíos y entregas</Link>
                </nav>
              </div>

              <div className="footer__col">
                <h4>Contacto</h4>
                <div className="footer__contact">
                  <span>Tostadores de café de especialidad</span>
                  <a href="tel:+57">+57 300 000 0000</a>
                  <span>Bogotá · Colombia</span>
                  <a href="mailto:hola@cafemoriah.com">hola@cafemoriah.com</a>
                </div>
                <nav className="footer__links" aria-label="Compañía" style={{marginTop: '1rem'}}>
                  <Link to="/pages/nuestra-historia">Nuestra historia</Link>
                  <Link to="/policies/shipping-policy">Política de envíos</Link>
                  <Link to="/policies/privacy-policy">Datos personales</Link>
                </nav>
              </div>

              <div className="footer__col">
                <h4>Recibe novedades</h4>
                <p className="footer__tagline" style={{marginBottom: '1rem'}}>
                  10% en tu primera compra al suscribirte.
                </p>
                <form
                  className="newsletter-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Tu correo"
                    aria-label="Correo electrónico"
                  />
                  <button
                    className="btn"
                    type="submit"
                    aria-label="Suscribirme"
                  >
                    <IconArrowRight className="btn-icon" />
                  </button>
                </form>
              </div>
            </div>

            <div className="container footer__bottom">
              <span>© {year} MORIAH Café · Hecho en Colombia</span>
              <div className="footer__pay" aria-label="Métodos de pago">
                <PaymentBadges />
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/** Minimal monochrome payment wordmarks (SVG, no colored boxes). */
function PaymentBadges() {
  const labels = ['VISA', 'MASTERCARD', 'PSE', 'NEQUI', 'SHOP PAY'];
  return (
    <>
      {labels.map((l) => (
        <span
          key={l}
          style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'rgba(247,243,234,0.65)',
            border: '1px solid rgba(247,243,234,0.18)',
            borderRadius: '4px',
            padding: '0.25rem 0.45rem',
          }}
        >
          {l}
        </span>
      ))}
    </>
  );
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
