import {useEffect, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router';
import {useAside} from '~/components/Aside';
import {IconBag, IconChevronDown, IconMenu, IconSearch} from '~/components/Icons';
import {useOptimisticCartCount} from '~/components/CartMain';
import {CONTACT, whatsappUrl} from '~/data/contact';

/**
 * Menú principal (6 entradas): lo que vende va a la izquierda, lo institucional
 * a la derecha. `destacado` resalta una sola entrada (el Club).
 */
const TX_NAV = [
  {
    title: 'Café',
    url: '/collections/cafes',
    items: [
      {title: 'Todos los cafés', url: '/collections/cafes', img: '/images/nav-todos-cafes.webp'},
      {title: 'Línea de Origen', url: '/collections/linea-origen', img: '/images/cafe-castillo-lavado.webp'},
      {title: 'Microlotes', url: '/collections/micro-lotes', img: '/images/cafe-pacamara.webp'},
      {title: 'Kit −15 %', url: '/products/kit-tres-origenes', img: '/images/nav-kit.webp'},
    ],
  },
  {title: 'Encuentra tu café', url: '/quiz'},
  {title: 'Club de la Memoria', url: '/suscripcion', destacado: true},
  {title: 'Merch', url: '/collections/merch'},
  {title: 'Blog', url: '/blog'},
  {title: 'Conócenos', url: '/conocenos'},
];

/**
 * @param {{cart: import('~/lib/cart').Cart}} props
 */
export function Header({cart}) {
  const {pathname} = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  // Navbar scroll-aware (réplica Tropicalia): transparente sobre el hero,
  // sólido al scrollear. Las páginas sin hero arrancan siempre sólidas.
  useEffect(() => {
    if (!isHome) return undefined;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const isSolid = !isHome || scrolled;

  return (
    <header className={`header${isSolid ? ' is-solid' : ''}`}>
      <NavLink prefetch="intent" to="/" className="header__brand" end>
        <img
          src="/images/logo-moriah.png"
          alt="MORIAH Café — Un café para el alma"
          width={38}
          height={38}
        />
        <span className="header__wordmark">MORIAH</span>
      </NavLink>
      <TropicaliaNav />
      <HeaderCtas cart={cart} />
    </header>
  );
}

function TropicaliaNav() {
  return (
    <nav className="header-menu-desktop" aria-label="Principal">
      {TX_NAV.map((item) =>
        item.items ? (
          <div className="tx-nav-group" key={item.title}>
            <NavLink className="header-menu-item" to={item.url} prefetch="intent">
              {item.title}
              <IconChevronDown className="header-menu-item__chevron" aria-hidden="true" />
            </NavLink>
            <div className="tx-nav-panel">
              {item.items.map((sub) => (
                <Link key={sub.title} to={sub.url} prefetch="intent">
                  {sub.img && (
                    <img
                      src={sub.img}
                      alt=""
                      aria-hidden="true"
                      width={180}
                      height={180}
                      loading="lazy"
                      className="tx-nav-panel-img"
                    />
                  )}
                  <span className="tx-nav-panel-label">{sub.title}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <NavLink
            className={`header-menu-item${item.destacado ? ' header-menu-item--destacado' : ''}`}
            key={item.title}
            to={item.url}
            prefetch="intent"
            end
          >
            {item.title}
          </NavLink>
        ),
      )}
    </nav>
  );
}

/** @param {{cart: import('~/lib/cart').Cart}} props */
function HeaderCtas({cart}) {
  return (
    <nav className="header-ctas" aria-label="Acciones">
      <SearchToggle />
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle"
      onClick={() => open('mobile')}
      aria-label="Abrir menú"
    >
      <IconMenu />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="icon-btn" onClick={() => open('search')} aria-label="Buscar">
      <IconSearch />
    </button>
  );
}

/**
 * Menú lateral móvil. Antes aplanaba los 15 destinos en una sola lista sin
 * jerarquía; ahora Café y Merch son secciones desplegables y las acciones de
 * cliente recurrente (Club, suscripción, contacto) viven al final.
 */
export function HeaderMenu({viewport}) {
  const {close} = useAside();
  if (viewport !== 'mobile') return null;

  return (
    <nav className="header-menu-mobile" aria-label="Principal">
      <NavLink end onClick={close} prefetch="intent" className="header-menu-item" to="/">
        Inicio
      </NavLink>

      {TX_NAV.map((item) =>
        item.items ? (
          <details className="header-menu-group" key={item.title}>
            <summary className="header-menu-item header-menu-group__summary">
              {item.title}
              <IconChevronDown className="header-menu-group__chevron" aria-hidden="true" />
            </summary>
            <div className="header-menu-group__items">
              {item.items.map((sub) => (
                <NavLink
                  end
                  key={sub.url}
                  onClick={close}
                  prefetch="intent"
                  className="header-menu-item header-menu-item--sub"
                  to={sub.url}
                >
                  {sub.title}
                </NavLink>
              ))}
            </div>
          </details>
        ) : (
          <NavLink
            className={`header-menu-item${item.destacado ? ' header-menu-item--destacado' : ''}`}
            end
            key={item.url}
            onClick={close}
            prefetch="intent"
            to={item.url}
          >
            {item.title}
          </NavLink>
        ),
      )}

      <div className="header-menu-mobile__foot">
        <Link
          className="header-menu-mobile__link"
          to="/suscripcion/gestionar"
          onClick={close}
        >
          Gestionar mi suscripción
        </Link>
        <a
          className="header-menu-mobile__link"
          href={CONTACT.hasWhatsapp ? whatsappUrl() : CONTACT.emailHref}
          rel="noopener noreferrer"
          target={CONTACT.hasWhatsapp ? '_blank' : undefined}
        >
          {CONTACT.hasWhatsapp ? 'Escríbenos por WhatsApp' : `Escríbenos a ${CONTACT.email}`}
        </a>
      </div>
    </nav>
  );
}

/** @param {{cart: import('~/lib/cart').Cart}} props */
function CartToggle({cart}) {
  const {open} = useAside();
  const count = useOptimisticCartCount(cart);

  return (
    <a
      href="/cart"
      className="icon-btn cart-count"
      aria-label={count > 0 ? `Carrito, ${count} productos` : 'Carrito'}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
      }}
    >
      <IconBag />
      {count > 0 && (
        <span className="cart-count__badge" aria-hidden="true">
          {count}
        </span>
      )}
    </a>
  );
}
