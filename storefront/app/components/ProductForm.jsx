import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {IconBag} from '~/components/Icons';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 *   product?: ProductFragment;
 * }}
 */
export function ProductForm({productOptions, selectedVariant, product}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  const available = selectedVariant?.availableForSale;

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="variant-group" key={option.name}>
            <span className="variant-group__label">{option.name}</span>
            <div className="variant-options">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available: optAvailable,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className="variant-option"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      data-selected={selected}
                      data-available={optAvailable}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }
                return (
                  <button
                    type="button"
                    className="variant-option"
                    key={option.name + name}
                    data-selected={selected}
                    data-available={optAvailable}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="pdp-buy">
        <div className="pdp-buy__row">
          <div className="qty-stepper" aria-label="Cantidad">
            <button
              type="button"
              aria-label="Disminuir cantidad"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              &minus;
            </button>
            <output>{quantity}</output>
            <button
              type="button"
              aria-label="Aumentar cantidad"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            >
              +
            </button>
          </div>
          <AddToCartButton
            className="btn btn--lg btn--block"
            disabled={!selectedVariant || !available}
            onClick={() => open('cart')}
            analytics={
              product
                ? {
                    products: [
                      {
                        productGid: product.id,
                        variantGid: selectedVariant?.id,
                        name: product.title,
                        variantName: selectedVariant?.title,
                        brand: product.vendor,
                        price: selectedVariant?.price?.amount,
                        quantity,
                      },
                    ],
                  }
                : undefined
            }
            lines={
              selectedVariant
                ? [{merchandiseId: selectedVariant.id, quantity, selectedVariant}]
                : []
            }
          >
            <IconBag width={18} height={18} />
            {available ? 'Agregar al carrito' : 'Agotado'}
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <span
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        display: 'inline-block',
        width: 18,
        height: 18,
        borderRadius: '50%',
        verticalAlign: '-3px',
        marginRight: 6,
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </span>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
