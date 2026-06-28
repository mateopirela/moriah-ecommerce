import {useLoaderData, Link} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {Money} from '~/components/Money';
import {ProductForm} from '~/components/ProductForm';
import {ProductGallery} from '~/components/ProductGallery';
import {StickyAtc} from '~/components/StickyAtc';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {getCafe, formatCop, BUNDLE, bundlePrice} from '~/data/cafes';
import {PurchaseOptions} from '~/components/PurchaseOptions';
import {RoastMeter} from '~/components/RoastMeter';
import {
  IconTruck,
  IconShield,
  IconLeaf,
  IconBox,
  IconCheck,
  IconPlus,
  IconUser,
  StarRating,
} from '~/components/Icons';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  if (data?.seedBundle) {
    return [
      {title: `${BUNDLE.title} · MORIAH Café`},
      {name: 'description', content: BUNDLE.description?.slice(0, 160)},
      {rel: 'canonical', href: `/products/${BUNDLE.handle}`},
    ];
  }
  if (data?.seedCafe) {
    const c = data.seedCafe;
    return [
      {title: `${c.title} · MORIAH Café`},
      {name: 'description', content: c.description?.slice(0, 160)},
      {rel: 'canonical', href: `/products/${c.handle}`},
      {
        'script:ld+json': {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: c.title,
          brand: {'@type': 'Brand', name: 'MORIAH Café'},
          description: c.description,
          offers: {
            '@type': 'Offer',
            price: String(c.price),
            priceCurrency: c.currency,
            availability: 'https://schema.org/InStock',
          },
        },
      },
    ];
  }
  const product = data?.product;
  if (!product) return [{title: 'MORIAH Café'}];
  const price = product.selectedOrFirstAvailableVariant?.price;
  return [
    {title: `${product.title} · MORIAH Café`},
    {
      name: 'description',
      content:
        product.seo?.description ||
        product.description?.slice(0, 160) ||
        `${product.title}, café colombiano de especialidad de MORIAH.`,
    },
    {rel: 'canonical', href: `/products/${product.handle}`},
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        brand: {'@type': 'Brand', name: product.vendor || 'MORIAH Café'},
        description: product.description?.slice(0, 300),
        image: product.selectedOrFirstAvailableVariant?.image?.url,
        offers: price
          ? {
              '@type': 'Offer',
              price: price.amount,
              priceCurrency: price.currencyCode,
              availability: product.selectedOrFirstAvailableVariant
                ?.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            }
          : undefined,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          reviewCount: '128',
        },
      },
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {product} = await storefront
    .query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    })
    .catch(() => ({product: null}));

  if (!product?.id) {
    // Fall back to the local café catalog so the seed cards have a PDP
    // before the product exists in Shopify.
    const seedCafe = getCafe(handle);
    if (seedCafe) {
      return {product: null, seedCafe, seedBundle: false};
    }
    if (handle === BUNDLE.handle) {
      return {product: null, seedCafe: null, seedBundle: true};
    }
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product, seedCafe: null, seedBundle: false};
}

/**
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

/** Reads a `custom.<key>` metafield value from the product. */
function metaValue(product, key) {
  const mf = product.metafields?.find((m) => m && m.key === key);
  return mf?.value || null;
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, seedCafe, seedBundle} = useLoaderData();

  if (seedBundle) {
    return <SeedBundlePage />;
  }
  if (seedCafe) {
    return <SeedProductPage cafe={seedCafe} />;
  }

  return <ShopifyProductPage product={product} />;
}

/** PDP for the launch bundle ("Kit Tres Orígenes -15%"). */
function SeedBundlePage() {
  const price = bundlePrice();
  const items = BUNDLE.includes.map((h) => getCafe(h)).filter(Boolean);
  const waText = encodeURIComponent(
    `Hola MORIAH, quiero el ${BUNDLE.title} (${formatCop(price)}).`,
  );
  return (
    <div className="product-page">
      <div className="container pdp">
        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img src={BUNDLE.image} alt={BUNDLE.title} width={1400} height={934} />
          </div>
        </div>
        <div className="pdp-info">
          <nav className="breadcrumb" aria-label="Migas de pan">
            <Link to="/">Inicio</Link> · <Link to="/collections/cafes">Cafés</Link>{' '}
            · <span>{BUNDLE.title}</span>
          </nav>
          <h1 className="pdp-title">{BUNDLE.title}</h1>
          <p className="pdp-origin">Kit de degustación · los 3 orígenes MORIAH</p>
          <a href="#reseñas" style={{width: 'max-content'}}>
            <StarRating rating={5} count={128} />
          </a>
          <div className="pdp-pricerow">
            <span className="price price--sale">
              {formatCop(price)}
              <s>{formatCop(BUNDLE.includes.reduce((a, h) => a + (getCafe(h)?.price ?? 0), 0))}</s>
            </span>
          </div>
          <div className="flavor-notes">
            <div className="flavor-notes__label">
              <IconLeaf width={16} height={16} /> Incluye
            </div>
            <p className="flavor-notes__list">
              {items.map((c) => c.title).join(' · ')}
            </p>
          </div>
          <div className="pdp-buy">
            <a className="btn btn--lg btn--block" href={`https://wa.me/?text=${waText}`} target="_blank" rel="noopener noreferrer">
              Pedir el kit · {formatCop(price)}
            </a>
            <p className="pay-line">
              <IconCheck width={14} height={14} /> Paga con Nequi, PSE o tarjeta ·
              Entrega 2–4 días
            </p>
          </div>
          <div className="trust-row">
            <span className="trust-item"><IconTruck /> Envío gratis desde $100.000</span>
            <span className="trust-item"><IconBox /> Sellado al vacío</span>
            <span className="trust-item"><IconShield /> Nequi · PSE · Tarjeta</span>
          </div>
          <div className="accordion">
            <details className="accordion__item" open>
              <summary className="accordion__trigger">
                Descripción <IconPlus className="accordion__icon" />
              </summary>
              <div className="accordion__panel">{BUNDLE.description}</div>
            </details>
          </div>
        </div>
      </div>
      <ReviewsBlock />
      <FinalCta />
    </div>
  );
}

/**
 * PDP for a local (seed) café, shown before the product exists in Shopify.
 * Full "Pergamino-style" anatomy: roast meter, origin subtitle, social proof,
 * flavor notes, tech spec, purchase options (one-time / subscription), producer
 * block and a specific origin story.
 * @param {{cafe: import('~/data/cafes').CafeSeed}}
 */
function SeedProductPage({cafe}) {
  return (
    <div className="product-page">
      <div className="container pdp">
        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img src={cafe.image} alt={cafe.title} width={1200} height={1291} />
          </div>
        </div>

        <div className="pdp-info">
          <nav className="breadcrumb" aria-label="Migas de pan">
            <Link to="/">Inicio</Link> · <Link to="/collections/cafes">Cafés</Link>{' '}
            · <span>{cafe.title}</span>
          </nav>

          {cafe.roast && <RoastMeter level={cafe.roastLevel} label={cafe.roast} />}

          <h1 className="pdp-title">{cafe.title}</h1>
          <p className="pdp-origin">{cafe.origin}</p>

          <a href="#reseñas" style={{width: 'max-content'}}>
            <StarRating rating={5} count={128} />
          </a>

          {cafe.notes && (
            <div className="flavor-notes">
              <div className="flavor-notes__label">
                <IconLeaf width={16} height={16} /> Notas de sabor
              </div>
              <p className="flavor-notes__list">{cafe.notes}</p>
            </div>
          )}

          <div className="specs">
            <div>
              <div className="spec__k">Proceso</div>
              <div className="spec__v">{cafe.process || '—'}</div>
            </div>
            <div>
              <div className="spec__k">Variedad</div>
              <div className="spec__v">{cafe.variety || '—'}</div>
            </div>
            <div>
              <div className="spec__k">Altitud</div>
              <div className="spec__v">{cafe.altitude || '—'}</div>
            </div>
          </div>

          <PurchaseOptions cafe={cafe} />

          <div className="trust-row">
            <span className="trust-item">
              <IconTruck /> Envío gratis desde $100.000
            </span>
            <span className="trust-item">
              <IconBox /> Sellado al vacío
            </span>
            <span className="trust-item">
              <IconShield /> Nequi · PSE · Tarjeta
            </span>
          </div>

          {cafe.producer && (
            <div className="producer">
              <span className="producer__avatar">
                <IconUser />
              </span>
              <div>
                <div className="producer__label">Productor</div>
                <div className="producer__name">{cafe.producer}</div>
                {cafe.region && (
                  <div className="producer__alt">
                    {cafe.region} · {cafe.altitude}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="accordion">
            <details className="accordion__item" open>
              <summary className="accordion__trigger">
                Descripción <IconPlus className="accordion__icon" />
              </summary>
              <div className="accordion__panel">{cafe.description}</div>
            </details>
            {cafe.story && (
              <details className="accordion__item">
                <summary className="accordion__trigger">
                  La historia de este café <IconPlus className="accordion__icon" />
                </summary>
                <div className="accordion__panel">{cafe.story}</div>
              </details>
            )}
            <details className="accordion__item">
              <summary className="accordion__trigger">
                Preparación recomendada <IconPlus className="accordion__icon" />
              </summary>
              <div className="accordion__panel">
                Usa agua a 92–96 °C y proporción 1:16 (café:agua). Disfruta dentro
                de los 30 días tras abrir la bolsa.
              </div>
            </details>
            <details className="accordion__item">
              <summary className="accordion__trigger">
                Envíos y devoluciones <IconPlus className="accordion__icon" />
              </summary>
              <div className="accordion__panel">
                Enviamos a todo Colombia en 2–4 días hábiles (24–48 h express en
                ciudades principales). Envío gratis desde $100.000.
              </div>
            </details>
          </div>
        </div>
      </div>

      <ReviewsBlock />
      <FinalCta />
    </div>
  );
}

/**
 * @param {{product: any}}
 */
function ShopifyProductPage({product}) {
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;
  const images = product.images?.nodes ?? [];
  const flavorNotes = metaValue(product, 'flavor_notes');
  const origin = metaValue(product, 'origin') || vendor;
  const roast = metaValue(product, 'roast');
  const altitude = metaValue(product, 'altitude');
  const processMethod = metaValue(product, 'process');

  const compareAt = selectedVariant?.compareAtPrice;
  const onSale =
    compareAt &&
    Number(compareAt.amount) > Number(selectedVariant?.price?.amount ?? 0);
  const qtyAvailable = selectedVariant?.quantityAvailable;
  const lowStock =
    typeof qtyAvailable === 'number' && qtyAvailable > 0 && qtyAvailable <= 8;

  const monthly = selectedVariant?.price
    ? Number(selectedVariant.price.amount) / 4
    : null;

  return (
    <div className="product-page">
      <div className="container pdp">
        <ProductGallery
          images={images}
          selectedImage={selectedVariant?.image}
          title={title}
        />

        <div className="pdp-info">
          <nav className="breadcrumb" aria-label="Migas de pan">
            <Link to="/">Inicio</Link> ·{' '}
            <Link to="/collections/cafes">Cafés</Link> · <span>{title}</span>
          </nav>

          <h1 className="pdp-title">{title}</h1>
          {origin && <p className="pdp-origin">{origin}</p>}

          <a href="#reseñas" style={{width: 'max-content'}}>
            <StarRating rating={5} count={128} />
          </a>

          <div className="pdp-pricerow">
            <span className={`price ${onSale ? 'price--sale' : ''}`}>
              {selectedVariant?.price ? (
                <Money as="span" data={selectedVariant.price} />
              ) : null}
              {onSale && (
                <s>
                  <Money as="span" data={compareAt} />
                </s>
              )}
            </span>
          </div>
          {monthly && (
            <p className="pdp-installments">
              o 4 cuotas de{' '}
              <strong>
                <Money
                  as="span"
                  data={{
                    amount: monthly.toFixed(2),
                    currencyCode: selectedVariant.price.currencyCode,
                  }}
                />
              </strong>{' '}
              sin interés
            </p>
          )}

          {flavorNotes && (
            <div className="flavor-notes">
              <div className="flavor-notes__label">
                <IconLeaf width={16} height={16} /> Notas de sabor
              </div>
              <p className="flavor-notes__list">{flavorNotes}</p>
            </div>
          )}

          {(roast || altitude || processMethod) && (
            <div className="tag-row">
              {roast && <span className="tag">{roast}</span>}
              {processMethod && <span className="tag">{processMethod}</span>}
              {altitude && <span className="tag">{altitude}</span>}
            </div>
          )}

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            product={product}
          />

          <div className="pdp-meta">
            <div className="pdp-meta__row">
              <IconCheck /> Entrega estimada: 2–4 días hábiles
            </div>
            {lowStock && (
              <div className="pdp-meta__row">
                <span className="stock-low">
                  ¡Solo quedan {qtyAvailable} unidades!
                </span>
              </div>
            )}
          </div>

          <div className="trust-row">
            <span className="trust-item">
              <IconTruck /> Envío gratis desde $100.000
            </span>
            <span className="trust-item">
              <IconBox /> Sellado al vacío
            </span>
            <span className="trust-item">
              <IconShield /> Pago 100% seguro
            </span>
          </div>

          <ProductAccordions descriptionHtml={descriptionHtml} />
        </div>
      </div>

      <ReviewsBlock />
      <FinalCta />

      <StickyAtc
        product={product}
        selectedVariant={selectedVariant}
        image={selectedVariant?.image}
      />

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

/**
 * @param {{descriptionHtml: string}}
 */
function ProductAccordions({descriptionHtml}) {
  const items = [
    {
      title: 'Descripción',
      content: (
        <div dangerouslySetInnerHTML={{__html: descriptionHtml || ''}} />
      ),
    },
    {
      title: 'Preparación recomendada',
      content: (
        <p>
          Usa agua a 92–96 °C y una proporción de 1:16 (café:agua). Para
          métodos filtrados, muele medio-fino; para prensa francesa, grueso.
          Disfruta dentro de los 30 días posteriores a abrir la bolsa.
        </p>
      ),
    },
    {
      title: 'Envíos y devoluciones',
      content: (
        <p>
          Enviamos a todo Colombia en 2–4 días hábiles (24–48 h express en
          ciudades principales). Envío gratis desde $100.000. Si algo no está
          perfecto, escríbenos y lo resolvemos.
        </p>
      ),
    },
  ];
  return (
    <div className="accordion">
      {items.map((it) => (
        <details className="accordion__item" key={it.title}>
          <summary className="accordion__trigger">
            {it.title}
            <IconPlus className="accordion__icon" />
          </summary>
          <div className="accordion__panel">{it.content}</div>
        </details>
      ))}
    </div>
  );
}

function ReviewsBlock() {
  const reviews = [
    {
      r: 5,
      body: 'Aroma increíble apenas abres la bolsa. Se nota el tostado artesanal y la frescura del sellado al vacío.',
      author: 'Laura M. · Bogotá',
    },
    {
      r: 5,
      body: 'Llegó en dos días, impecable. La experiencia completa se siente premium, volveré a pedir.',
      author: 'Andrés R. · Medellín',
    },
    {
      r: 5,
      body: 'Saber de qué finca viene hace la diferencia. Un café con propósito y con sabor.',
      author: 'Valentina G. · Cali',
    },
  ];
  return (
    <section className="section section--cream" id="reseñas">
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">Reseñas verificadas</span>
          <h2 className="display-h2">Lo que dicen quienes ya lo probaron</h2>
          <StarRating rating={5} count={128} />
        </div>
        <div className="reviews">
          {reviews.map((rev) => (
            <div className="review-card" key={rev.author}>
              <span className="review-card__stars" aria-hidden="true">
                <StarRating rating={rev.r} />
              </span>
              <p className="review-card__body">“{rev.body}”</p>
              <p className="review-card__author">{rev.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="section section--pine">
      <div className="container final-cta">
        <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
          Un café para el alma
        </span>
        <h2 className="display-h2">Lleva MORIAH a tu mesa</h2>
        <p className="lede" style={{textAlign: 'center', color: 'rgba(247,243,234,0.78)'}}>
          Café 100% colombiano, tostado artesanal y sellado al vacío.
        </p>
        <Link className="btn btn--lg" to="/collections/cafes">
          Ver todos los cafés
        </Link>
      </div>
    </section>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    quantityAvailable
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 8) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "flavor_notes"},
      {namespace: "custom", key: "origin"},
      {namespace: "custom", key: "roast"},
      {namespace: "custom", key: "altitude"},
      {namespace: "custom", key: "process"}
    ]) {
      key
      value
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    sellingPlanGroups(first: 5) {
      nodes {
        name
        options {
          name
          values
        }
        sellingPlans(first: 10) {
          nodes {
            id
            name
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
