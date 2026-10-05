/**
 * MORIAH — catálogo unificado (cafés + kit + merch).
 *
 * Fuente única de verdad para precios, opciones, colecciones y búsqueda.
 * Los datos viven en `app/data/*.js`; aquí se normalizan a una forma común
 * que consumen carrito, checkout, PDP y colecciones.
 */
import {
  BUNDLE,
  CAFES,
  FREE_SHIP_THRESHOLD,
  GRINDS,
  SIZES,
  SUBSCRIPTION,
  bundlePrice,
  formatCop,
  getCafe,
  subscriptionPrice,
} from '~/data/cafes';
import {MERCH, MERCH_CATEGORIES, getMerch} from '~/data/merch';

export {FREE_SHIP_THRESHOLD, GRINDS, SIZES, SUBSCRIPTION, formatCop};

export const CURRENCY = 'COP';

/** Costo de envío cuando el subtotal no alcanza el umbral de envío gratis. */
export const SHIPPING_FEE = 12000;

/** Redondea al múltiplo de 100 COP más cercano. */
export function round100(n) {
  return Math.round(n / 100) * 100;
}

/** COP → centavos (Wompi cobra en centavos). */
export function toCents(cop) {
  return Math.round(cop * 100);
}

/** Tarifa de envío para las ciudades con entrega local. */
export const LOCAL_SHIPPING_FEE = 6000;

/** Ciudades con tarifa local (en minúsculas y sin tildes). Edita aquí para sumar otras. */
export const LOCAL_SHIPPING_CITIES = ['barranquilla'];

/** Minúsculas, sin tildes ni espacios sobrantes: "  Bogotá " → "bogota". */
export function normalizeCity(city) {
  return String(city ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/** @param {string} [city] */
export function isLocalCity(city) {
  return LOCAL_SHIPPING_CITIES.includes(normalizeCity(city));
}

/**
 * Costo de envío: gratis desde el umbral; si no, $6.000 en ciudades con tarifa local
 * y $12.000 en el resto. Sin ciudad se asume la tarifa general (ver `shippingPending`).
 * @param {number} subtotal
 * @param {string} [city]
 */
export function shippingFor(subtotal, city) {
  if (subtotal >= FREE_SHIP_THRESHOLD) return 0;
  return isLocalCity(city) ? LOCAL_SHIPPING_FEE : SHIPPING_FEE;
}

/** Días entre entregas para cada etiqueta de frecuencia del Club. */
export const FREQUENCY_DAYS = {
  'Cada 2 semanas': 14,
  'Cada 4 semanas': 28,
  'Cada 6 semanas': 42,
};

/** @param {string} label */
export function frequencyDays(label) {
  return FREQUENCY_DAYS[label] ?? null;
}

function normalizeCafe(cafe) {
  return {
    handle: cafe.handle,
    kind: 'cafe',
    title: cafe.title,
    price: cafe.price,
    image: cafe.image,
    description: cafe.description,
    badge: cafe.badge,
    subtitle: cafe.origin,
    notes: cafe.notes,
    roast: cafe.roast,
    flavor: cafe.flavor,
    tono: cafe.tono,
    cutout: cafe.heroImage,
    body: cafe.body,
    acidity: cafe.acidity,
    altitude: cafe.altitude,
    tags: cafe.tags ?? [],
    subscribable: true,
    hasSizes: true,
    hasGrinds: true,
    raw: cafe,
  };
}

function normalizeMerch(item) {
  const category = MERCH_CATEGORIES.find((c) => c.handle === item.category);
  return {
    handle: item.handle,
    kind: 'merch',
    title: item.title,
    price: item.price,
    image: item.image,
    description: item.description,
    badge: item.badge,
    subtitle: category?.title ?? 'Merch',
    category: item.category,
    short: item.short,
    tags: [],
    subscribable: false,
    hasSizes: false,
    hasGrinds: false,
    raw: item,
  };
}

function normalizeBundle() {
  return {
    handle: BUNDLE.handle,
    kind: 'bundle',
    title: BUNDLE.title,
    price: bundlePrice(),
    compareAtPrice: BUNDLE.includes.reduce(
      (acc, h) => acc + (getCafe(h)?.price ?? 0),
      0,
    ),
    image: BUNDLE.image,
    description: BUNDLE.description,
    badge: BUNDLE.badge,
    subtitle: 'Kit de degustación · los 3 orígenes MORIAH',
    includes: BUNDLE.includes,
    tags: [],
    subscribable: false,
    hasSizes: false,
    hasGrinds: false,
    raw: BUNDLE,
  };
}

/** @returns {Array<ReturnType<typeof normalizeCafe>>} */
export function allProducts() {
  return [
    ...CAFES.map(normalizeCafe),
    normalizeBundle(),
    ...MERCH.map(normalizeMerch),
  ];
}

/** @param {string} handle */
export function getProduct(handle) {
  if (!handle) return null;
  const cafe = getCafe(handle);
  if (cafe) return normalizeCafe(cafe);
  if (handle === BUNDLE.handle) return normalizeBundle();
  const merch = getMerch(handle);
  if (merch) return normalizeMerch(merch);
  return null;
}

/**
 * Precio unitario de un producto con sus opciones (gramaje aplica solo a cafés).
 * @param {string} handle
 * @param {{size?: string, subscription?: boolean}} [options]
 */
export function unitPrice(handle, {size, subscription = false} = {}) {
  const product = getProduct(handle);
  if (!product) return 0;
  let price = product.price;
  if (product.hasSizes) {
    const sizeDef = SIZES.find((s) => s.label === size) ?? SIZES[0];
    price = round100(product.price * sizeDef.mult);
  }
  return subscription ? subscriptionPrice(price) : price;
}

/**
 * Monto de una entrega del Club (precio con descuento × cantidad + envío).
 * Puro: se usa en el servidor para cobrar y en el navegador para previsualizar.
 * @param {{cafeHandle: string, sizeLabel: string, quantity: number}} input
 */
export function subscriptionAmounts({cafeHandle, sizeLabel, quantity, city}) {
  const unit = unitPrice(cafeHandle, {size: sizeLabel, subscription: true});
  const qty = Math.max(1, Math.min(10, Math.floor(Number(quantity) || 1)));
  const subtotal = unit * qty;
  const shipping = shippingFor(subtotal, city);
  return {
    unitPrice: unit,
    subtotal,
    shipping,
    total: subtotal + shipping,
    unitPriceCents: toCents(unit),
    subtotalCents: toCents(subtotal),
    shippingCents: toCents(shipping),
    amountCents: toCents(subtotal + shipping),
  };
}

/**
 * Opciones legibles para una línea (carrito, checkout, emails).
 * @param {string} handle
 * @param {{size?: string, grind?: string}} [options]
 */
export function lineOptions(handle, {size, grind} = {}) {
  const product = getProduct(handle);
  if (!product?.hasSizes) return [];
  return [
    {name: 'Gramaje', value: size || SIZES[0].label},
    {name: 'Molienda', value: grind || GRINDS[0]},
  ];
}

/** Valida y normaliza opciones de un café (evita valores inventados). */
export function normalizeOptions(handle, {size, grind} = {}) {
  const product = getProduct(handle);
  if (!product?.hasSizes) return {size: null, grind: null};
  const sizeDef = SIZES.find((s) => s.label === size) ?? SIZES[0];
  const grindValue = GRINDS.includes(grind) ? grind : GRINDS[0];
  return {size: sizeDef.label, grind: grindValue};
}

const COLLECTION_DEFS = {
  all: {
    title: 'Todos los productos',
    eyebrow: 'Nuestra tienda',
    description: 'Cafés, kits y merch MORIAH.',
    filter: () => true,
  },
  cafes: {
    title: 'Nuestros Cafés',
    eyebrow: 'Nuestros cafés',
    description:
      'Café 100% colombiano de especialidad, cultivado con intención y respeto por la tierra.',
    filter: (p) => p.kind === 'cafe',
  },
  'linea-origen': {
    title: 'Línea de Origen',
    eyebrow: 'Nuestros cafés',
    description: 'Los cafés de la casa: dulces, equilibrados, para todos los días.',
    filter: (p) => p.kind === 'cafe' && ['core', 'special'].includes(p.raw.tier),
  },
  'micro-lotes': {
    title: 'Microlotes',
    eyebrow: 'Nuestros cafés',
    description: 'Ediciones limitadas de fincas aliadas. Pocas bolsas, mucha historia.',
    filter: (p) => p.kind === 'cafe' && p.raw.tier === 'premium',
  },
  'club-de-la-memoria': {
    title: 'Club de la Memoria',
    eyebrow: 'Suscripción',
    description: `Recibe tu café en casa con ${Math.round(
      SUBSCRIPTION.discount * 100,
    )}% de descuento en cada entrega. Pausa o cancela cuando quieras.`,
    filter: (p) => p.subscribable,
    club: true,
  },
  'kit-el-legado': {
    title: 'Kit El Legado',
    eyebrow: 'Para regalar',
    description: 'El ritual completo: los tres orígenes y la caja insignia.',
    filter: (p) => p.kind === 'bundle' || p.handle === 'caja-el-legado',
  },
  merch: {
    title: 'Merch',
    eyebrow: 'Para vestir y para el ritual',
    description: 'El manifiesto hecho objeto.',
    filter: (p) => p.kind === 'merch',
  },
  ...Object.fromEntries(
    MERCH_CATEGORIES.map((c) => [
      c.handle,
      {
        title: c.title,
        eyebrow: 'Merch',
        description: 'El manifiesto hecho objeto.',
        filter: (p) => p.kind === 'merch' && p.category === c.handle,
      },
    ]),
  ),
};

export const COLLECTION_HANDLES = Object.keys(COLLECTION_DEFS);

/** @param {string} handle */
export function getCollection(handle) {
  const def = COLLECTION_DEFS[handle];
  if (!def) return null;
  return {
    handle,
    title: def.title,
    eyebrow: def.eyebrow,
    description: def.description,
    club: Boolean(def.club),
    products: allProducts().filter(def.filter),
  };
}

/**
 * Búsqueda simple sobre el catálogo local (título > notas/descripción > tags).
 * @param {string} query
 */
export function searchProducts(query) {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const score = (p) => {
    const title = p.title.toLowerCase();
    const body = [p.description, p.notes, p.subtitle, ...(p.tags ?? [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    let s = 0;
    for (const t of terms) {
      if (title.includes(t)) s += 3;
      else if (body.includes(t)) s += 1;
      else return 0;
    }
    return s;
  };
  return allProducts()
    .map((p) => ({p, s: score(p)}))
    .filter(({s}) => s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({p}) => p);
}

/**
 * Sugerencias para el upsell del carrito: productos que no están en el carrito.
 * @param {string[]} excludeHandles
 * @param {number} [limit]
 */
export function upsellSuggestions(excludeHandles, limit = 2) {
  const priority = ['kit-tres-origenes', 'bourbon-rosado', 'pocillo-de-verdad', 'pacamara'];
  const all = allProducts();
  const ranked = [
    ...priority.map((h) => all.find((p) => p.handle === h)).filter(Boolean),
    ...all,
  ];
  const seen = new Set();
  const out = [];
  for (const p of ranked) {
    if (seen.has(p.handle) || excludeHandles.includes(p.handle)) continue;
    seen.add(p.handle);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}
