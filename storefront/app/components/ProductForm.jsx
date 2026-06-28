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

  // Selling plans (subscription "Club de la Memoria"). Degrades gracefully:
  // when the product has no selling plans, only one-time purchase is shown.
  const sellingPlans =
    product?.sellingPlanGroups?.nodes?.[0]?.sellingPlans?.nodes ?? [];
  const hasSubscription = sellingPlans.length > 0;
  const [purchaseType, setPurchaseType] = useState('once'); // 'once' | 'sub'
  const [sellingPlanId, setSellingPlanId] = useState(sellingPlans[0]?.id ?? '');

  const activePlanId =
    hasSubscription && purchaseType === 'sub' ? sellingPlanId : undefined;

  const available = selectedVariant?.availableForSale;

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="tx-variant-group" key={option.name}>
            <span className="tx-titulo" style={{marginBottom:'0.4rem'}}>{option.name}</span>
            <div className="tx-variant-pills">
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
                      className="tx-variant-pill"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      data-selected={selected ? 'true' : 'false'}
                      data-unavailable={!optAvailable ? 'true' : 'false'}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }
                return (
                  <button
                    type="button"
                    className="tx-variant-pill"
                    key={option.name + name}
                    data-selected={selected ? 'true' : 'false'}
                    data-unavailable={!exists ? 'true' : 'false'}
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

      {hasSubscription && (
        <div className="buy-type" role="radiogroup" aria-label="Tipo de compra">
          <button
            type="button"
            className="buy-type__opt"
            role="radio"
            aria-checked={purchaseType === 'once'}
            data-active={purchaseType === 'once'}
            onClick={() => setPurchaseType('once')}
          >
            <span className="buy-type__head">
              <span className="buy-type__dot" />
              Compra única
            </span>
          </button>
          <button
            type="button"
            className="buy-type__opt buy-type__opt--sub"
            role="radio"
            aria-checked={purchaseType === 'sub'}
            data-active={purchaseType === 'sub'}
            onClick={() => setPurchaseType('sub')}
          >
            <span className="buy-type__head">
              <span className="buy-type__dot" />
              Suscríbete y ahorra
              <span className="buy-type__save">−15%</span>
            </span>
          </button>
        </div>
      )}

      {hasSubscription && purchaseType === 'sub' && (
        <div className="variant-group">
          <label className="variant-group__label" htmlFor="selling-plan">
            Frecuencia de entrega
          </label>
          <select
            id="selling-plan"
            className="select"
            value={sellingPlanId}
            onChange={(e) => setSellingPlanId(e.target.value)}
          >
            {sellingPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
      )}

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
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity,
                      selectedVariant,
                      ...(activePlanId ? {sellingPlanId: activePlanId} : {}),
                    },
                  ]
                : []
            }
          >
            <IconBag width={18} height={18} />
            {available
              ? activePlanId
                ? 'Suscribirme'
                : 'Agregar al carrito'
              : 'Agotado'}
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
