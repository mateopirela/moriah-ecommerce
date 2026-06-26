/**
 * MORIAH — catálogo local de cafés.
 *
 * Fuente: contenido real de cafemoriah.com + estructura inspirada en los
 * mejores e-commerce de café de especialidad (Pergamino, Colo, Café Britt,
 * BUNA, Café Orfeu). Se usa como catálogo mientras no esté conectado el
 * Storefront API de Shopify. Cuando Shopify tenga la colección `cafes` con
 * productos, esos reemplazan automáticamente a este seed.
 *
 * NOTA: los campos `altitude`, `producer`, `variety` y `story` son
 * placeholders editables — reemplázalos con los datos reales de cada finca
 * (la especificidad = credibilidad, como hace Pergamino con El Bombo).
 */

// --- Reglas de negocio (Club Moriah) -----------------------------
export const SUBSCRIPTION = {
  discount: 0.15, // 15% off al suscribirse
  frequencies: ['Cada 2 semanas', 'Cada 4 semanas', 'Cada 6 semanas'],
  defaultFrequency: 'Cada 4 semanas',
  perks: [
    '15% de descuento en cada entrega',
    'Café de regalo en tu primer pedido',
    'Pausa o cancela cuando quieras',
    'Paga con Nequi, PSE o tarjeta',
  ],
};

export const FREE_SHIP_THRESHOLD = 100000;

// Tamaños (gramaje) con multiplicador sobre el precio base (340 g).
export const SIZES = [
  {label: '340 g', mult: 1},
  {label: '500 g', mult: 1.4},
];

// Molienda (estilo Pergamino: grano / media / fina / gruesa).
export const GRINDS = [
  'Grano entero',
  'Molida media (goteo / V60)',
  'Molida fina (espresso)',
  'Molida gruesa (prensa francesa)',
];

export const CAFES = [
  {
    handle: 'bourbon-rosado',
    title: 'Bourbon Rosado',
    tier: 'core', // café de la casa — peldaño accesible
    tierLabel: 'Línea de Origen',
    badge: 'De la casa',
    origin: 'Finca La Esmeralda, Colombia',
    region: 'Antioquia, Colombia',
    variety: 'Bourbon Rosado',
    process: 'Lavado',
    roast: 'Tueste Medio',
    roastLevel: 3, // 1 claro … 5 oscuro
    altitude: '1.700 – 1.850 msnm',
    altitudeM: 1775,
    producer: 'Familia caficultora aliada · Finca La Esmeralda',
    producerName: 'Familia Restrepo',
    producerPhoto: '/images/productores/la-esmeralda.webp',
    producerStory: 'La familia Restrepo ha cultivado café en La Esmeralda durante tres generaciones. En sus manos, el Bourbon Rosado alcanza su máxima expresión: dulzor natural, acidez cítrica limpia, cuerpo redondo. Cultivan respetando el ecosistema, vendiendo únicamente a compradores que entienden la diferencia.',
    notes: 'Chocolate, Piel de Naranja, Grosella Negra, Gaseosa de Toronja',
    tags: ['100% Arábica', 'Comercio Justo'],
    price: 45000,
    currency: 'COP',
    image: '/images/producto-bolsa.webp',
    description:
      'Un Bourbon Rosado de la Finca La Esmeralda con un perfil dulce y cítrico. Notas de chocolate y piel de naranja sobre una acidez de grosella negra y gaseosa de toronja. Tueste medio que resalta su cuerpo y equilibrio.',
    story:
      'Cuando abres la bolsa, el aroma te detiene. No es solo olor a café tostado; es la mañana de altura, es luz filtrada entre árboles de sombra, es la mano del Bourbon que la familia Restrepo ha perfeccionado durante décadas en La Esmeralda.\n\nEste café nace a 1.775 metros donde el clima templado y el suelo volcánico crean condiciones únicas. Se cosecha de forma selectiva entre octubre y diciembre, se procesa por lavado para resaltar su acidez natural, y se tuesta en tandas pequeñas. Cada grano cuenta la historia de una finca donde el tiempo todavía respeta el café.',
  },
  {
    handle: 'blend-catillo-caturra',
    title: 'Blend Castillo Caturra',
    tier: 'special', // origen especial — peldaño medio
    tierLabel: 'Línea de Origen',
    badge: 'Origen especial',
    origin: 'Finca La Esmeralda, Colombia',
    region: 'Antioquia, Colombia',
    variety: 'Castillo y Caturra',
    process: 'Honey',
    roast: 'Tueste Medio',
    roastLevel: 3,
    altitude: '1.750 – 1.900 msnm',
    altitudeM: 1825,
    producer: 'Familia caficultora aliada · Finca La Esmeralda',
    producerName: 'Doña Elena Restrepo',
    producerPhoto: '/images/productores/doña-elena.webp',
    producerStory: 'Doña Elena es la guardiana de las variedades de La Esmeralda. Con más de 40 años cultivando, ha dominado el proceso honey: el punto exacto en el que el mucílago seco aporta dulzura sin fermentación indeseada. Sus tandas son pequeñas, su mano segura, su café inconfundible.',
    notes: 'Chocolate, Piel de Naranja, Uva',
    tags: ['100% Arábica', 'Comercio Justo'],
    price: 52000,
    currency: 'COP',
    image: '/images/producto-bolsa.webp',
    description:
      'Un blend de variedades Castillo y Caturra de la Finca La Esmeralda. Dulce y redondo, con notas de chocolate, piel de naranja y uva. Proceso honey y tueste medio, ideal para el ritual diario.',
    story:
      'Hay un momento en la cosecha que Doña Elena nunca olvida. Es cuando el Castillo y la Caturra alcanzan su maduración exacta —ni verde, ni sobremadura— y las manos de la cuadrilla saben cuál grano tomar.\n\nEste blend es su signatura: el café del día a día que no sacrifica complejidad. El proceso honey, donde parte del mucílago se mantiene durante el secado, le aporta una dulzura de uva y chocolate que sube naturalmente. Ni fuerza bruta, ni finura excesiva; simplemente un café que se toma en la mesa de la mañana con la familia, y que deja huella.',
  },
  {
    handle: 'geisha',
    title: 'Geisha',
    tier: 'premium', // micro-lote premium — peldaño alto
    tierLabel: 'Micro-lotes',
    badge: 'Edición limitada',
    origin: 'Finca San Rafael, Colombia',
    region: 'Colombia',
    variety: 'Geisha',
    process: 'Lavado',
    roast: 'Tueste Claro',
    roastLevel: 2,
    altitude: '1.850 – 2.000 msnm',
    altitudeM: 1925,
    producer: 'Finca San Rafael',
    producerName: 'Cooperativa San Rafael',
    producerPhoto: '/images/productores/san-rafael.webp',
    producerStory: 'En San Rafael cultivan la Geisha, la variedad que cambió el mundo del café hace dos décadas. A casi 2.000 metros, esta variedad etíope expresada en suelo colombiano revela aromas florales que parecen imposibles en una taza. Es rara, es delicada, es extraordinaria.',
    notes: 'Flor de Jamaica, Tomillo, Toronjil',
    tags: ['Edición Limitada', 'Orgánico'],
    price: 75000,
    currency: 'COP',
    image: '/images/producto-bolsa.webp',
    description:
      'Nuestra edición más exclusiva. Una Geisha de la Finca San Rafael, floral y herbal, con notas de flor de Jamaica, tomillo y toronjil. Tueste claro para preservar su complejidad aromática. Edición limitada.',
    story:
      'La Geisha llegó a Colombia hace poco más de una década, y San Rafael fue de los primeros en cultivarla en serio. A casi 2.000 metros, esta variedad etíope revela aromas que no existen en otras altitudes ni regiones.\n\nCuando la tuestas claro, como hacemos aquí, los florales emergen primero: flor de Jamaica, jazmín, notas herbal de tomillo y toronjil. Es un café que desafía la expectativa, que te hace detenerte. No es para tomar corriendo; es para la ocasión en que de verdad merece la pena.\n\nProducción limitada. Algunos años ni siquiera alcanza para ser café estable; es edición única de la cosecha.',
  },
];

// Bundle de lanzamiento — sube el ticket promedio (estilo "Kit tres orígenes -15%").
export const BUNDLE = {
  handle: 'kit-tres-origenes',
  title: 'Kit Tres Orígenes',
  badge: '15% DCTO',
  discount: 0.15,
  includes: ['bourbon-rosado', 'blend-catillo-caturra', 'geisha'],
  image: '/images/kit-bolsas.webp',
  description:
    'Los tres cafés MORIAH en un solo kit: Bourbon Rosado, Blend Castillo Caturra y Geisha. La forma perfecta de recorrer nuestros orígenes —y de regalar— con 15% de descuento.',
};

/** Precio del kit (suma de los 3 con descuento). */
export function bundlePrice() {
  const sum = BUNDLE.includes.reduce((acc, h) => acc + (getCafe(h)?.price ?? 0), 0);
  return Math.round((sum * (1 - BUNDLE.discount)) / 100) * 100;
}

/** @param {string} handle */
export function getCafe(handle) {
  return CAFES.find((c) => c.handle === handle) || null;
}

/** Precio con descuento de suscripción. */
export function subscriptionPrice(amount) {
  return Math.round((amount * (1 - SUBSCRIPTION.discount)) / 100) * 100;
}

/** Format a COP price like the brand: $45.000 */
export function formatCop(amount, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
