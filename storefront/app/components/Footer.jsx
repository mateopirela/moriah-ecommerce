import {Link} from 'react-router';
import {IconFacebook, IconInstagram, IconWhatsapp} from '~/components/Icons';
import {CONTACT, whatsappUrl} from '~/data/contact';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="tx-footer">
      {/* ── Banda superior: tagline + navegación + contacto ── */}
      <div className="tx-footer__top tx-container">
        <div className="tx-footer__tagline">Tostadores de cafés de especialidad</div>

        <div className="tx-footer__cols">
          <nav className="tx-footer__nav" aria-label="Empresa">
            <Link to="/pages/nuestra-historia">Nuestra historia</Link>
            <Link to="/collections/cafes">Nuestros cafés</Link>
            <Link to="/suscripcion">Club de la Memoria</Link>
            <Link to="/suscripcion/gestionar">Gestionar mi suscripción</Link>
            <Link to="/pages/contacto">Contacto</Link>
          </nav>

          <div className="tx-footer__contact">
            <div className="tx-footer__social">
              <a
                href={CONTACT.instagram}
                aria-label="Instagram"
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconInstagram />
              </a>
              {CONTACT.hasWhatsapp && (
                <a
                  href={whatsappUrl()}
                  aria-label="WhatsApp"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconWhatsapp />
                </a>
              )}
              <a
                href={CONTACT.facebook}
                aria-label="Facebook"
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconFacebook />
              </a>
            </div>
            {CONTACT.phoneHref && (
              <a href={CONTACT.phoneHref} className="tx-footer__link">
                {CONTACT.phoneDisplay}
              </a>
            )}
            <span className="tx-footer__link tx-footer__link--static">{CONTACT.city}</span>
            <a href={CONTACT.emailHref} className="tx-footer__link">
              {CONTACT.email}
            </a>
          </div>

          <div className="tx-footer__logo-wrap">
            <img
              src="/images/logo-moriah.png"
              alt="MORIAH Café"
              width={120}
              height={120}
              className="tx-footer__logo"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* ── Franja de políticas + copyright ── */}
      <div className="tx-footer__bottom tx-container">
        <Link to="/policies/shipping-policy" className="tx-footer__policy">
          Política de envíos
        </Link>
        <Link to="/policies/refund-policy" className="tx-footer__policy">
          Cambios y devoluciones
        </Link>
        <Link to="/policies/privacy-policy" className="tx-footer__policy">
          Política de datos personales
        </Link>
        <Link to="/policies/terms-of-service" className="tx-footer__policy">
          Términos y condiciones
        </Link>
        <span className="tx-footer__copy">MORIAH © {year}</span>
      </div>
    </footer>
  );
}
