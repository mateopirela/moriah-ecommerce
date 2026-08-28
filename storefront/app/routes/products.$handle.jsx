import {useEffect, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {PurchaseOptions} from '~/components/PurchaseOptions';
import {RoastMeter} from '~/components/RoastMeter';
import {StickyAtc} from '~/components/StickyAtc';
import {
  IconBag,
  IconCheck,
  IconLeaf,
  IconPlus,
  IconUser,
  StarRating,
} from '~/components/Icons';
import {formatCop, getCafe} from '~/data/cafes';
import {getProduct} from '~/lib/catalog';
import {analytics} from '~/lib/analytics';

/** @type {import('react-router').MetaFunction} */
export const meta = ({data}) => {
  const p = data?.product;
  if (!p) return [{title: 'MORIAH Café'}];
  return [
    {title: `${p.title} · MORIAH Café`},
    {name: 'description', content: p.description?.slice(0, 160)},
    {rel: 'canonical', href: `/products/${p.handle}`},
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.title,
        brand: {'@type': 'Brand', name: 'MORIAH Café'},
        description: p.description,
        image: p.image,
        offers: {
          '@type': 'Offer',
          price: String(p.price),
          priceCurrency: 'COP',
          availability: 'https://schema.org/InStock',
        },
      },
    },
  ];
};

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({params}) {
  const product = getProduct(params.handle);
  if (!product) throw new Response(null, {status: 404});
  // `raw` contiene funciones/valores no serializables solo en teoría; lo
  // dejamos fuera y cada vista recarga el detalle desde el catálogo.
  const {raw, ...serializable} = product;
  return {product: serializable};
}

export default function Product() {
  const {product} = useLoaderData();

  useEffect(() => {
    analytics.viewItem(product);
  }, [product]);

  if (product.kind === 'cafe') return <CafeProductPage cafe={getCafe(product.handle)} />;
  if (product.kind === 'bundle') return <BundleProductPage product={product} />;
  return <MerchProductPage product={product} />;
}

/**
 * Fila de 5 iconos de metadatos — Tropicalia: .div-block-385.cafe
 */
function MetaIconsRow({variety, heroe, territory, farm, proceso}) {
  const items = [
    {icon: '/icons/icono-cafe-dorado.svg', label: 'Variedad', value: variety},
    {icon: '/icons/icono-heroe-dorado.svg', label: 'Héroe', value: heroe},
    {icon: '/icons/icono-colombia-dorado.svg', label: 'Territorio', value: territory},
    {icon: '/icons/icono-finca-dorado.svg', label: 'Finca', value: farm},
    {icon: '/icons/icono-empaque-dorado.svg', label: 'Proceso', value: proceso},
  ].filter((it) => it.value);

  if (!items.length) return null;

  return (
    <div className="tx-meta-icons">
      {items.map((it) => (
        <div key={it.label} className="tx-meta-icon-item">
          <img src={it.icon} alt="" aria-hidden="true" width={38} height={38} className="tx-meta-icon" />
          <div className="tx-meta-icon-text">
            <span className="tx-titulo">{it.label}</span>
            <span className="tx-parrafo">{it.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** PDP de un café: medidor de tueste, origen, notas, ficha técnica, compra/suscripción, productor e historia. */
function CafeProductPage({cafe}) {
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
            <Link to="/">Inicio</Link> · <Link to="/collections/cafes">Cafés</Link> ·{' '}
            <span>{cafe.title}</span>
          </nav>

          {cafe.roast && <RoastMeter level={cafe.roastLevel} label={cafe.roast} />}

          <h1 className="pdp-title">{cafe.title}</h1>
          <p className="pdp-origin">{cafe.origin}</p>

          <MetaIconsRow
            variety={cafe.variety}
            heroe={cafe.producer}
            territory={cafe.region}
            farm={cafe.farm}
            proceso={cafe.process}
          />

          <a href="#reseñas" style={{width: 'max-content'}}>
            <StarRating rating={5} />
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

          <ShippingBadges />

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
                Usa agua a 92–96 °C y proporción 1:16 (café:agua). Disfruta dentro de los 30
                días tras abrir la bolsa.
              </div>
            </details>
            <details className="accordion__item">
              <summary className="accordion__trigger">
                Envíos y devoluciones <IconPlus className="accordion__icon" />
              </summary>
              <div className="accordion__panel">
                Enviamos a todo Colombia en 2–4 días hábiles (24–48 h express en ciudades
                principales). Envío gratis desde $100.000.
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

/** PDP del kit de lanzamiento ("Kit Tres Orígenes −15%"). */
function BundleProductPage({product}) {
  const {open} = useAside();
  const items = product.includes.map((h) => getCafe(h)).filter(Boolean);
  return (
    <div className="product-page">
      <div className="container pdp">
        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img src={product.image} alt={product.title} width={1400} height={934} />
          </div>
        </div>
        <div className="pdp-info">
          <nav className="breadcrumb" aria-label="Migas de pan">
            <Link to="/">Inicio</Link> · <Link to="/collections/cafes">Cafés</Link> ·{' '}
            <span>{product.title}</span>
          </nav>
          <h1 className="pdp-title">{product.title}</h1>
          <p className="pdp-origin">{product.subtitle}</p>
          <a href="#reseñas" style={{width: 'max-content'}}>
            <StarRating rating={5} />
          </a>
          <div className="pdp-pricerow">
            <span className="price price--sale">
              {formatCop(product.price)}
              <s>{formatCop(product.compareAtPrice)}</s>
            </span>
          </div>
          <div className="flavor-notes">
            <div className="flavor-notes__label">
              <IconLeaf width={16} height={16} /> Incluye
            </div>
            <p className="flavor-notes__list">{items.map((c) => c.title).join(' · ')}</p>
          </div>
          <div className="pdp-buy">
            <AddToCartButton
              className="btn btn--lg btn--block"
              handle={product.handle}
              product={product}
              onClick={() => open('cart')}
            >
              <IconBag width={18} height={18} />
              Agregar el kit · {formatCop(product.price)}
            </AddToCartButton>
            <p className="pay-line">
              <IconCheck width={14} height={14} /> Paga con Nequi, PSE o tarjeta · Entrega 2–4
              días
            </p>
          </div>
          <ShippingBadges />
          <div className="accordion">
            <details className="accordion__item" open>
              <summary className="accordion__trigger">
                Descripción <IconPlus className="accordion__icon" />
              </summary>
              <div className="accordion__panel">{product.description}</div>
            </details>
          </div>
        </div>
      </div>
      <ReviewsBlock />
      <FinalCta />
      <StickyAtc product={product} price={product.price} />
    </div>
  );
}

/** PDP de merch: imagen, categoría, precio, descripción y compra. */
function MerchProductPage({product}) {
  const {open} = useAside();
  const [qty, setQty] = useState(1);
  return (
    <div className="product-page">
      <div className="container pdp">
        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img src={product.image} alt={product.title} width={1200} height={1200} />
          </div>
        </div>
        <div className="pdp-info">
          <nav className="breadcrumb" aria-label="Migas de pan">
            <Link to="/">Inicio</Link> · <Link to="/collections/merch">Merch</Link> ·{' '}
            <span>{product.title}</span>
          </nav>
          {product.badge && <span className="badge badge--gold">{product.badge}</span>}
          <h1 className="pdp-title">{product.title}</h1>
          <p className="pdp-origin">{product.subtitle}</p>
          <div className="pdp-pricerow">
            <span className="price">{formatCop(product.price)}</span>
          </div>
          {product.short && <p className="lede">{product.short}</p>}
          <div className="pdp-buy">
            <div className="pdp-buy__row">
              <div className="qty-stepper" aria-label="Cantidad">
                <button type="button" aria-label="Disminuir cantidad" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  &minus;
                </button>
                <output>{qty}</output>
                <button type="button" aria-label="Aumentar cantidad" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                  +
                </button>
              </div>
              <AddToCartButton
                className="btn btn--lg btn--block"
                handle={product.handle}
                quantity={qty}
                product={product}
                onClick={() => open('cart')}
              >
                <IconBag width={18} height={18} />
                Agregar al carrito · {formatCop(product.price * qty)}
              </AddToCartButton>
            </div>
            <p className="pay-line">
              <IconCheck width={14} height={14} /> Paga con Nequi, PSE o tarjeta · Entrega 2–4
              días
            </p>
          </div>
          <ShippingBadges />
          <div className="accordion">
            <details className="accordion__item" open>
              <summary className="accordion__trigger">
                Descripción <IconPlus className="accordion__icon" />
              </summary>
              <div className="accordion__panel">{product.description}</div>
            </details>
            <details className="accordion__item">
              <summary className="accordion__trigger">
                Cambios y devoluciones <IconPlus className="accordion__icon" />
              </summary>
              <div className="accordion__panel">
                Aceptamos cambios de merch sin uso dentro de los 30 días siguientes a la entrega.
                Ver <Link to="/policies/refund-policy">política de cambios</Link>.
              </div>
            </details>
          </div>
        </div>
      </div>
      <FinalCta />
      <StickyAtc product={product} price={product.price} />
    </div>
  );
}

/** Shipping info badges — Tropicalia: .div-block-523 */
function ShippingBadges() {
  return (
    <div className="tx-shipping-row">
      <div className="tx-shipping-item">
        <img src="/icons/icono-local-dorado.svg" alt="" aria-hidden="true" width={28} height={28} />
        <p>Bogotá: entrega en 2–3 días hábiles.</p>
      </div>
      <div className="tx-shipping-item">
        <img src="/icons/icono-nacional-dorado.svg" alt="" aria-hidden="true" width={28} height={28} />
        <p>Nacional: 3–5 días hábiles · gratis desde $100.000.</p>
      </div>
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
          <StarRating rating={5} />
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
