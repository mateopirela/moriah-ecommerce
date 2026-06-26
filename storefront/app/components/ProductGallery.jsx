import {useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';

/**
 * PDP image gallery: large main image + thumbnail strip.
 * Falls back gracefully to the selected variant image when a product
 * has a single image.
 * @param {{
 *   images: Array<{id?: string, url: string, altText?: string|null, width?: number, height?: number}>;
 *   selectedImage?: {id?: string, url: string, altText?: string|null} | null;
 *   title: string;
 * }}
 */
export function ProductGallery({images = [], selectedImage, title}) {
  const gallery =
    images.length > 0
      ? images
      : selectedImage
        ? [selectedImage]
        : [];

  const [active, setActive] = useState(0);

  // When the variant image changes, sync the main image if it exists in set.
  useEffect(() => {
    if (!selectedImage?.id) return;
    const idx = gallery.findIndex((img) => img.id === selectedImage.id);
    if (idx >= 0) setActive(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage?.id]);

  if (gallery.length === 0) {
    return <div className="pdp-gallery__main" aria-hidden="true" />;
  }

  const main = gallery[Math.min(active, gallery.length - 1)];

  return (
    <div className="pdp-gallery">
      <div className="pdp-gallery__main">
        <Image
          data={main}
          alt={main.altText || title}
          sizes="(min-width: 900px) 600px, 100vw"
          loading="eager"
        />
      </div>
      {gallery.length > 1 && (
        <div className="pdp-gallery__thumbs" role="tablist" aria-label="Galería">
          {gallery.map((img, i) => (
            <button
              key={img.id || i}
              className="pdp-thumb"
              aria-current={i === active}
              aria-label={`Ver imagen ${i + 1}`}
              onClick={() => setActive(i)}
            >
              <Image data={img} alt={img.altText || `${title} ${i + 1}`} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
