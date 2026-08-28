import {useEffect, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router';
import {useAside} from '~/components/Aside';
import {IconBag, IconMenu, IconSearch} from '~/components/Icons';
import {useOptimisticCartCount} from '~/components/CartMain';

/**
 * Navbar — réplica de la estructura de tropicaliacoffee.com:
 * logo · CAFÉ▾ · MERCH▾ · CATACIÓN · PREPARA TU CAFÉ · TIENDA · CONTACTO · iconos
 */
const TX_NAV = [
  {
    title: 'Café',
    url: '/collections/cafes',
    items: [
      {title: 'Todos', url: '/collections/cafes', img: '/images/lineup-bolsas.webp'},
      {title: 'Línea de Origen', url: '/collections/linea-origen', img: '/images/cafe-bolsa.webp'},
      {title: 'Micro-lotes', url: '/collections/micro-lotes', img: '/images/producto-bolsa.webp'},
      {title: 'Club de la Memoria', url: '/collections/club-de-la-memoria', img: '/images/kit-bolsas.webp'},
    ],
  },
  {
    title: 'Merch',
    url: '/collections/merch',
    items: [
      {title: 'Pocillos', url: '/collections/pocillos', img: '/images/equipo-moriah.webp'},
      {title: 'Para vestir', url: '/collections/para-vestir', img: '/images/tostado-moriah.webp'},
      {title: 'Accesorios', url: '/collections/accesorios', img: '/images/hero-bolsa.webp'},
      {title: 'Caja regalo', url: '/collections/caja-regalo', img: '/images/kit-bolsas.webp'},
    ],
  },
  {title: 'Catación', url: '/quiz'},
  {title: 'Prepara tu café', url: '/pages/prepara-tu-cafe'},
  {title: 'Tienda', url: '/collections/all'},
  {title: 'Contacto', url: '/pages/contacto'},
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
    <nav className="header-menu-desktop" role="navigation" aria-label="Principal">
      {TX_NAV.map((item) =>
        item.items ? (
          <div className="tx-nav-group" key={item.title}>
            <NavLink className="header-menu-item" to={item.url} prefetch="intent">
              {item.title} <span aria-hidden="true">▾</span>
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
            className="header-menu-item"
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
    <nav className="header-ctas" role="navigation" aria-label="Acciones">
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
    <button className="icon-btn" onClick={() => open('search')}>
      <IconSearch />
      <span className="sr-only">Buscar</span>
    </button>
  );
}

/** Menú lateral móvil — reutiliza los ítems de la nav Tropicalia. */
export function HeaderMenu({viewport}) {
  const {close} = useAside();
  if (viewport !== 'mobile') return null;
  const flat = TX_NAV.flatMap((item) => (item.items ? [item, ...item.items] : [item]));
  return (
    <nav className="header-menu-mobile" role="navigation" aria-label="Principal">
      <NavLink end onClick={close} prefetch="intent" className="header-menu-item" to="/">
        Inicio
      </NavLink>
      {flat.map((item, i) => (
        <NavLink
          className="header-menu-item"
          end
          key={`${item.title}-${i}`}
          onClick={close}
          prefetch="intent"
          to={item.url}
        >
          {item.title}
        </NavLink>
      ))}
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
      onClick={(e) => {
        e.preventDefault();
        open('cart');
      }}
    >
      <IconBag />
      <span className="sr-only">Carrito</span>
      {count > 0 && <span className="cart-count__badge">{count}</span>}
    </a>
  );
}
