import {useEffect, useRef, useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {IconBag} from '~/components/Icons';
import {formatCop} from '~/lib/catalog';

/**
 * Barra fija de compra.
 *
 * Antes aparecía a partir de 620px de scroll, así que durante buena parte del
 * PDP convivían dos botones "Agregar" idénticos. Ahora observa la caja de
 * compra principal (`.pdp-buy`) y solo aparece cuando esa caja sale de pantalla.
 *
 * @param {{
 *   product: {handle: string, title: string, image?: string},
 *   price: number,
 *   size?: string|null,
 *   grind?: string|null,
 * }} props
 */
export function StickyAtc({product, price, size, grind}) {
  const {open} = useAside();
  const [visible, setVisible] = useState(false);
  const fallback = useRef(false);

  useEffect(() => {
    const buyBox = document.querySelector('.pdp-buy');

    if (!buyBox || typeof IntersectionObserver === 'undefined') {
      // Reserva: sin caja de compra visible, la barra se comporta como antes.
      fallback.current = true;
      const onScroll = () => setVisible(window.scrollY > 620);
      onScroll();
      window.addEventListener('scroll', onScroll, {passive: true});
      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Visible solo si la caja principal ya pasó hacia arriba.
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      {threshold: 0, rootMargin: '0px 0px -80px 0px'},
    );
    observer.observe(buyBox);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`sticky-atc ${visible ? 'visible' : ''}`} aria-hidden={!visible}>
      <div className="sticky-atc__info">
        {product.image && (
          <img src={product.image} alt="" width={44} height={44} aria-hidden="true" />
        )}
        <div className="sticky-atc__meta-extra">
          <div className="sticky-atc__title">{product.title}</div>
          <span className="sticky-atc__price">{formatCop(price)}</span>
        </div>
      </div>
      <AddToCartButton
        className="btn"
        handle={product.handle}
        size={size}
        grind={grind}
        product={{...product, price}}
        /* Oculta = fuera del orden de tabulación. Cuando es visible pasamos
           `undefined` para que el botón siga usando el estado del fetcher. */
        disabled={visible ? undefined : true}
        onClick={() => open('cart')}
      >
        <IconBag width={18} height={18} aria-hidden="true" />
        Agregar
      </AddToCartButton>
    </div>
  );
}
