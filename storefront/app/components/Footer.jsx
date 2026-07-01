import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {
  IconInstagram,
  IconWhatsapp,
  IconFacebook,
} from '~/components/Icons';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {() => <FooterInner />}
      </Await>
    </Suspense>
  );
}

function FooterInner() {
  const year = new Date().getFullYear();
  return (
    <footer className="tx-footer">
      {/* ── Banda superior: tagline + navegación + contacto ── */}
      <div className="tx-footer__top tx-container">
        <div className="tx-footer__tagline">
          Tostadores de cafés de especialidad
        </div>

        <div className="tx-footer__cols">
          {/* nav links */}
          <nav className="tx-footer__nav" aria-label="Empresa">
            <Link to="/pages/nuestra-historia">Nuestra historia</Link>
            <Link to="/collections/cafes">Nuestros cafés</Link>
            <Link to="/pages/contacto">Contacto</Link>
          </nav>

          {/* social + contacto */}
          <div className="tx-footer__contact">
            <div className="tx-footer__social">
              <a
                href="https://instagram.com/cafemoriah"
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
                href="https://facebook.com/cafemoriah"
                aria-label="Facebook"
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconFacebook />
              </a>
            </div>
            <a href="tel:+57" className="tx-footer__link">+57 300 000 0000</a>
            <span className="tx-footer__link">Bogotá · Colombia</span>
            <a href="mailto:hola@cafemoriah.com" className="tx-footer__link">
              hola@cafemoriah.com
            </a>
          </div>

          {/* logo Moriah a la derecha, centrado verticalmente */}
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
        <Link to="/policies/privacy-policy" className="tx-footer__policy">
          Política de datos personales
        </Link>
        <span>MORIAH © {year}</span>
      </div>
    </footer>
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
