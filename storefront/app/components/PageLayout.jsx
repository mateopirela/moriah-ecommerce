import {AnnouncementBar} from '~/components/AnnouncementBar';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {SearchPredictive} from '~/components/SearchPredictive';

/**
 * @param {{cart: import('~/lib/cart').Cart, children?: React.ReactNode}} props
 */
export function PageLayout({cart, children = null}) {
  return (
    <Aside.Provider>
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
      <main>{children}</main>
      <Footer />
    </Aside.Provider>
  );
}
