import {useEffect, useRef, useState} from 'react';
import {Money} from '~/components/Money';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {IconBag} from '~/components/Icons';

/**
 * Sticky add-to-cart bar that slides up once the main buy box scrolls
 * out of view. Never lose the buy button (StoreForge win #6).
 * @param {{
 *   product: any;
 *   selectedVariant: any;
 *   image?: {url: string, altText?: string|null} | null;
 * }}
 */
export function StickyAtc({product, selectedVariant, image}) {
  const {open} = useAside();
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Place a sentinel at the top of the page flow; when the user scrolls
    // past ~600px the bar appears. Uses scroll position to avoid coupling
    // to a specific DOM node that may re-render with variant changes.
    const onScroll = () => {
      setVisible(window.scrollY > 620);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const available = selectedVariant?.availableForSale;

  return (
    <div
      ref={sentinelRef}
      className={`sticky-atc ${visible ? 'visible' : ''}`}
      aria-hidden={!visible}
    >
      <div className="sticky-atc__info">
        {image?.url && (
          <img src={image.url} alt="" width={44} height={44} aria-hidden="true" />
        )}
        <div className="sticky-atc__meta-extra">
          <div className="sticky-atc__title">{product.title}</div>
          {selectedVariant?.price && (
            <span className="sticky-atc__price">
              <Money as="span" data={selectedVariant.price} />
            </span>
          )}
        </div>
      </div>
      <AddToCartButton
        className="btn"
        disabled={!selectedVariant || !available}
        onClick={() => open('cart')}
        lines={
          selectedVariant
            ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}]
            : []
        }
      >
        <IconBag width={18} height={18} />
        {available ? 'Agregar' : 'Agotado'}
      </AddToCartButton>
    </div>
  );
}
