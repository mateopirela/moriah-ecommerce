import {useEffect, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {PurchaseOptions} from '~/components/PurchaseOptions';
import {RoastMeter} from '~/components/RoastMeter';
import {StickyAtc} from '~/components/StickyAtc';
import {Testimonials} from '~/components/Testimonials';
import {IconBag, IconCheck, IconLeaf, IconPlus, IconUser} from '~/components/Icons';
import {formatCop, getCafe} from '~/data/cafes';
import {getProduct} from '~/lib/catalog';
import {siteUrl} from '~/lib/env.server';
import {analytics} from '~/lib/analytics';

/** @type {import('react-router').MetaFunction} */
export const meta = ({data}) => {
  const p = data?.product;
  if (!p) return [{title: 'MORIAH Café'}];
  const origin = data.origin ?? '';
  const image = p.image?.startsWith('http') ? p.image : `${origin}${p.image ?? ''}`;
  const url = `${origin}/products/${p.handle}`;
  return [
    {title: `${p.title} · MORIAH Café`},
    {name: 'description', content: p.description?.slice(0, 160)},
    {tagName: 'link', rel: 'canonical', href: url},
    {property: 'og:title', content: `${p.title} · MORIAH Café`},
    {property: 'og:description', content: p.description?.slice(0, 200)},
    {property: 'og:type', content: 'product'},
    {property: 'og:url', content: url},
    // Absoluta: con una ruta relativa WhatsApp e Instagram no muestran imagen.
    {property: 'og:image', content: image},
    {name: 'twitter:card', content: 'summary_large_image'},
    {
      'script:ld+json': {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.title,
        brand: {'@type': 'Brand', name: 'MORIAH Café'},
        description: p.description,
        image,
        offers: {
          '@type': 'Offer',
          url,
          price: String(p.price),
          priceCurrency: 'COP',
          availability: 'https://schema.org/InStock',
        },
      },
    },
  ];
};

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({params, request}) {
  const product = getProduct(params.handle);
  if (!product) throw new Response(null, {status: 404});
  // `raw` (el objeto original del catálogo) no viaja al cliente; cada vista
  // recarga el detalle desde el catálogo.
  const serializable = {...product};
  delete serializable.raw;
  return {product: serializable, origin: siteUrl(request)};
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
 * Encabezado del producto. Vive fuera de la columna de detalle para que en
 * móvil el nombre y el precio aparezcan ANTES de la foto: antes había que
 * bajar ~1.200px para saber qué café estabas mirando.
 */
function PdpHead({breadcrumb, roast, roastLevel, title, subtitle, price, priceFrom, compareAt}) {
  return (
    <div className="pdp-head">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link to="/">Inicio</Link> · <Link to={breadcrumb.url}>{breadcrumb.label}</Link> ·{' '}
        <span>{title}</span>
      </nav>
      {roast && <RoastMeter level={roastLevel} label={roast} />}
      <h1 className="pdp-title">{title}</h1>
      {subtitle && <p className="pdp-origin">{subtitle}</p>}
      <p className="pdp-pricerow">
        <span className={`price${compareAt ? ' price--sale' : ''}`}>
          {priceFrom && <span className="price__from">Desde </span>}
          {formatCop(price)}
          {compareAt && <s>{formatCop(compareAt)}</s>}
        </span>
      </p>
    </div>
  );
}

/**
 * Fila de iconos de metadatos — Tropicalia: .div-block-385.cafe
 */
function MetaIconsRow({variety, heroe, territory, farm, proceso, altitude}) {
  const items = [
    {icon: '/icons/icono-cafe-dorado.svg', label: 'Variedad', value: variety},
    {icon: '/icons/icono-heroe-dorado.svg', label: 'Productor', value: heroe},
    {icon: '/icons/icono-colombia-dorado.svg', label: 'Territorio', value: territory},
    {icon: '/icons/icono-finca-dorado.svg', label: 'Finca', value: farm},
    {icon: '/icons/icono-empaque-dorado.svg', label: 'Proceso', value: proceso},
    {icon: '/icons/icono-cafe-dorado.svg', label: 'Altitud', value: altitude},
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

/** PDP de un café: medidor de tueste, origen, notas, compra/suscripción, productor e historia. */
function CafeProductPage({cafe}) {
  return (
    <div className="product-page">
      <div className="container pdp">
        <PdpHead
          breadcrumb={{url: '/collections/cafes', label: 'Cafés'}}
          roast={cafe.roast}
          roastLevel={cafe.roastLevel}
          title={cafe.title}
          subtitle={cafe.origin}
          price={cafe.price}
          priceFrom
        />

        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img
              src={cafe.image}
              alt={`Bolsa de café ${cafe.title} de MORIAH`}
              width={1200}
              height={1291}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="pdp-info">
          {cafe.notes && (
            <div className="flavor-notes">
              <div className="flavor-notes__label">
                <IconLeaf width={16} height={16} aria-hidden="true" /> Notas de sabor
              </div>
              <p className="flavor-notes__list">{cafe.notes}</p>
            </div>
          )}

          <PurchaseOptions cafe={cafe} />

          <ShippingBadges />

          {/* Una sola ficha técnica: antes Proceso y Variedad se repetían en la
              fila de iconos y en una tabla de specs justo debajo. */}
          <MetaIconsRow
            variety={cafe.variety}
            heroe={cafe.producer}
            territory={cafe.region}
            farm={cafe.farm}
            proceso={cafe.process}
            altitude={cafe.altitude}
          />

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

      <Testimonials />
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
        <PdpHead
          breadcrumb={{url: '/collections/cafes', label: 'Cafés'}}
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
          compareAt={product.compareAtPrice}
        />

        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img
              src={product.image}
              alt={`${product.title} de MORIAH`}
              width={1400}
              height={934}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="pdp-info">
          <div className="flavor-notes">
            <div className="flavor-notes__label">
              <IconLeaf width={16} height={16} aria-hidden="true" /> Incluye
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
              <IconBag width={18} height={18} aria-hidden="true" />
              Agregar el kit · {formatCop(product.price)}
            </AddToCartButton>
            <p className="pay-line">
              <IconCheck width={14} height={14} aria-hidden="true" /> Paga con Nequi, PSE o
              tarjeta · Entrega 2–4 días
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
      <Testimonials />
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
        <PdpHead
          breadcrumb={{url: '/collections/merch', label: 'Merch'}}
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
        />

        <div className="pdp-gallery">
          <div className="pdp-gallery__main">
            <img
              src={product.image}
              alt={`${product.title} de MORIAH`}
              width={1200}
              height={1200}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="pdp-info">
          {product.badge && <span className="badge badge--gold">{product.badge}</span>}
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
                <IconBag width={18} height={18} aria-hidden="true" />
                Agregar · {formatCop(product.price * qty)}
              </AddToCartButton>
            </div>
            <p className="pay-line">
              <IconCheck width={14} height={14} aria-hidden="true" /> Paga con Nequi, PSE o
              tarjeta · Entrega 2–4 días
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

function FinalCta() {
  return (
    <section className="section section--pine">
      <div className="container final-cta">
        <span className="eyebrow eyebrow--on-dark">Un café para el alma</span>
        <h2 className="display-h2">Lleva MORIAH a tu mesa</h2>
        <p className="lede lede--on-dark final-cta__lede">
          Café 100% colombiano, tostado artesanal y sellado al vacío.
        </p>
        <Link className="btn btn--lg" to="/collections/cafes">
          Ver todos los cafés
        </Link>
      </div>
    </section>
  );
}

/** @typedef {import('./+types/products.$handle').Route} Route */
