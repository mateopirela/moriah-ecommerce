import {useEffect, useState} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {IconBag} from '~/components/Icons';
import {formatCop} from '~/lib/catalog';

/**
 * Barra fija de compra que aparece cuando el bloque principal sale de pantalla.
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

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 620);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
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
        onClick={() => open('cart')}
      >
        <IconBag width={18} height={18} />
        Agregar
      </AddToCartButton>
    </div>
  );
}
