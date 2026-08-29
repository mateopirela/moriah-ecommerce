import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import tokenStyles from '~/styles/tokens.css?url';
import baseStyles from '~/styles/base.css?url';
import componentStyles from '~/styles/components.css?url';
import layoutStyles from '~/styles/layout.css?url';
import homeStyles from '~/styles/home.css?url';
import productStyles from '~/styles/product.css?url';
import tropicaliaStyles from '~/styles/tropicalia.css?url';
import checkoutStyles from '~/styles/checkout.css?url';
import {PageLayout} from '~/components/PageLayout';
import {Tracking} from '~/components/Tracking';
import {useNonce} from '~/lib/nonce';
import {env} from '~/lib/env.server';
import {loadCart} from '~/lib/cart.server';

/**
 * Evita re-ejecutar el loader raíz en cada navegación: solo tras mutaciones
 * (agregar al carrito, etc.) o revalidación explícita.
 * @type {import('react-router').ShouldRevalidateFunction}
 */
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
    {rel: 'preconnect', href: 'https://api.fontshare.com'},
    {
      // Tipografías de marca (BRANDBOARD MORIAH): Satoshi (Fontshare) + Fraunces
      // (Google) como stand-in de "TBJ Siromi Regular" para titulares.
      rel: 'stylesheet',
      href: 'https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&display=swap',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/** @param {import('react-router').LoaderFunctionArgs} args */
export async function loader({request}) {
  return {
    cart: await loadCart(request),
    gaId: env('PUBLIC_GA4_ID') || null,
    metaPixelId: env('PUBLIC_META_PIXEL_ID') || null,
  };
}

/** @param {{children?: React.ReactNode}} props */
export function Layout({children}) {
  const nonce = useNonce();

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#19332f" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={tokenStyles}></link>
        <link rel="stylesheet" href={baseStyles}></link>
        <link rel="stylesheet" href={componentStyles}></link>
        <link rel="stylesheet" href={layoutStyles}></link>
        <link rel="stylesheet" href={homeStyles}></link>
        <link rel="stylesheet" href={productStyles}></link>
        {/* Tropicalia template — cargado al final para ganar especificidad */}
        <link rel="stylesheet" href={tropicaliaStyles}></link>
        <link rel="stylesheet" href={checkoutStyles}></link>
        <Meta />
        <Links />
        {/* Marca que JS está disponible ANTES del primer paint: el
            scroll-reveal solo oculta secciones cuando puede revelarlas.
            Sin esto, con JS lento o desactivado la página quedaba en blanco. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData('root');
  const nonce = useNonce();

  if (!data) {
    return <Outlet />;
  }

  return (
    <>
      <Tracking gaId={data.gaId} metaPixelId={data.metaPixelId} nonce={nonce} />
      <PageLayout cart={data.cart}>
        <Outlet />
      </PageLayout>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const data = useRouteLoaderData('root');
  let errorMessage = 'Algo salió mal. Inténtalo de nuevo en un momento.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage =
      error.status === 404
        ? 'No encontramos esta página.'
        : error?.data?.message ?? error.data ?? errorMessage;
  } else if (error instanceof Error && process.env.NODE_ENV !== 'production') {
    errorMessage = error.message;
  }

  const isNotFound = errorStatus === 404;
  const content = (
    <div className="route-error">
      <span className="route-error__code">Error {errorStatus}</span>
      <h1 className="display-h2">
        {isNotFound ? 'No encontramos esa página' : 'Algo salió mal de nuestro lado'}
      </h1>
      <p className="route-error__lede">
        {isNotFound
          ? 'Puede que el enlace haya cambiado. Estos son los caminos más cortos de vuelta al café:'
          : 'Ya estamos revisándolo. Puedes intentar de nuevo o escribirnos y te ayudamos a completar tu pedido.'}
      </p>
      <div className="route-error__actions">
        <Link className="btn" to="/collections/cafes">
          Ver los cafés
        </Link>
        <Link className="btn btn--ghost" to="/">
          Ir al inicio
        </Link>
      </div>
      <p className="route-error__help">
        ¿Necesitas ayuda? <Link to="/pages/contacto">Escríbenos</Link> o revisa el{' '}
        <Link to="/suscripcion/gestionar">estado de tu suscripción</Link>.
      </p>
      {errorMessage && process.env.NODE_ENV !== 'production' && (
        <pre className="route-error__debug">{errorMessage}</pre>
      )}
    </div>
  );

  return data ? <PageLayout cart={data.cart}>{content}</PageLayout> : content;
}
