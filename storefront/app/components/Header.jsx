import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {IconSearch, IconBag, IconUser, IconMenu} from '~/components/Icons';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <header className="header">
      <NavLink prefetch="intent" to="/" className="header__brand" end>
        <img
          src="/images/logo-moriah.png"
          alt={`${shop.name} — Un café para el alma`}
          width={46}
          height={46}
        />
        <span className="header__wordmark">MORIAH</span>
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  // Use the Shopify menu only once it's been customized for MORIAH (it links
  // to the cafés). Until then (Mock.shop demo menu, or a fresh store's default
  // "Inicio/Catálogo/Contacto"), keep the MORIAH nav defined in code.
  const isMoriahMenu = menu?.items?.some((item) =>
    /\/collections\/cafes|\/quiz|nuestra-historia/.test(item.url || ''),
  );
  const navMenu = (isMoriahMenu && menu) || FALLBACK_HEADER_MENU;

  return (
    <nav className={className} role="navigation" aria-label="Principal">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className="header-menu-item"
          to="/"
        >
          Inicio
        </NavLink>
      )}
      {navMenu.items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation" aria-label="Acciones">
      <SearchToggle />
      <NavLink prefetch="intent" to="/account" className="icon-btn">
        <Suspense fallback={<IconUser />}>
          <Await resolve={isLoggedIn} errorElement={<IconUser />}>
            {() => <IconUser />}
          </Await>
        </Suspense>
        <span className="sr-only">Cuenta</span>
      </NavLink>
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

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="icon-btn cart-count"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <IconBag />
      <span className="sr-only">Carrito</span>
      {count > 0 && <span className="cart-count__badge">{count}</span>}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/moriah-main',
  items: [
    {
      id: 'moriah-cafes',
      resourceId: null,
      tags: [],
      title: 'Cafés',
      type: 'HTTP',
      url: '/collections/cafes',
      items: [],
    },
    {
      id: 'moriah-club',
      resourceId: null,
      tags: [],
      title: 'Club de la Memoria',
      type: 'HTTP',
      url: '/#club',
      items: [],
    },
    {
      id: 'moriah-memoria',
      resourceId: null,
      tags: [],
      title: 'Comparte tu historia',
      type: 'HTTP',
      url: '/memoria',
      items: [],
    },
    {
      id: 'moriah-quiz',
      resourceId: null,
      tags: [],
      title: 'Encuentra tu café',
      type: 'HTTP',
      url: '/quiz',
      items: [],
    },
    {
      id: 'moriah-historia',
      resourceId: null,
      tags: [],
      title: 'Nuestra Historia',
      type: 'HTTP',
      url: '/pages/nuestra-historia',
      items: [],
    },
    {
      id: 'moriah-envios',
      resourceId: null,
      tags: [],
      title: 'Envíos',
      type: 'HTTP',
      url: '/#envios',
      items: [],
    },
  ],
};

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
