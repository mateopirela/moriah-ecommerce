import {useLocation} from 'react-router';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {SearchPredictive} from '~/components/SearchPredictive';
import {WhatsAppFloat} from '~/components/WhatsAppFloat';

/**
 * @param {{cart: import('~/lib/cart').Cart, children?: React.ReactNode}} props
 */
export function PageLayout({cart, children = null}) {
  const {pathname} = useLocation();
  // El pago va sin menú, pie ni botón de WhatsApp flotante: menos distracciones.
  // La página lleva su propia cabecera mínima (logo y "Volver al carrito").
  if (pathname === '/checkout') {
    return (
      <Aside.Provider>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <main id="contenido" tabIndex={-1}>
          {children}
        </main>
      </Aside.Provider>
    );
  }
  return (
    <Aside.Provider>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Aside type="cart" heading="TU CARRITO">
        <CartMain cart={cart} layout="aside" />
      </Aside>
      <Aside type="search" heading="BUSCAR">
        <SearchPredictive />
      </Aside>
      <Aside type="mobile" heading="MENÚ">
        <HeaderMenu viewport="mobile" />
      </Aside>
      <AnnouncementBar />
      <Header cart={cart} />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </Aside.Provider>
  );
}
