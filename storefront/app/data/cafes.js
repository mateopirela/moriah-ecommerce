/**
 * MORIAH — catálogo local de cafés.
 *
 * Fuente: contenido real de cafemoriah.com + estructura inspirada en los
 * mejores e-commerce de café de especialidad (Pergamino, Colo, Café Britt,
 * BUNA, Café Orfeu). Es la fuente de verdad del catálogo: precios, opciones
 * y textos de cada café viven aquí.
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

// Presentaciones. Hoy todas las bolsas son de 250 g (el precio de `CAFES` es
// el de 250 g). Si algún día hay otro tamaño, agrégalo aquí con su
// multiplicador sobre el precio base, p. ej. {label: '500 g', mult: 1.9}.
export const SIZES = [{label: '250 g', mult: 1}];

// Molienda (estilo Pergamino: grano / media / fina / gruesa).
export const GRINDS = [
  'Grano entero',
  'Molida media (goteo / V60)',
  'Molida fina (espresso)',
  'Molida gruesa (prensa francesa)',
];

/**
 * CÓMO AGREGAR, QUITAR O CAMBIAR UN CAFÉ
 *  - Agregar: copia un bloque completo de `CAFES` (el último, por ejemplo),
 *    cambia `handle` (la URL: /products/<handle>), los textos y el precio.
 *  - Quitar: borra su bloque. El home, el hero, el quiz y el carrito se
 *    ajustan solos. (El Kit Tres Orígenes de `BUNDLE` y los ejemplos de
 *    `catalog.js` usan handles concretos: revísalos si quitas uno de ellos.)
 *  - Orden: el orden de este arreglo es el orden en la web. Los 3 primeros
 *    salen en la fila del hero.
 *  - `heroImage` (opcional): bolsa recortada sin fondo en /public/images.
 *    Al pasar el mouse por el café en el hero, la bolsa grande cambia a esa.
 *  - `quizTags`: etiquetas que describen el café. El quiz suma puntos cuando
 *    las respuestas del cliente coinciden. Vocabulario disponible en
 *    app/data/quiz.js (sabor: dulce, frutal, floral, equilibrado · cuerpo:
 *    ligero, medio, cuerpo · momento: ritual, tarde, especial, explorar ·
 *    cómo lo toma: solo, leche, endulzado · método: filtro, inmersion,
 *    espresso, aeropress). Un café sin etiquetas igual aparece como
 *    alternativa, pero casi nunca como recomendado.
 */
export const CAFES = [
  {
    handle: 'bourbon-rosado',
    title: 'Bourbon Rosado',
    tier: 'premium', // microlote de Pitalito
    tierLabel: 'Microlotes',
    origin: 'Pitalito, Huila, Colombia',
    region: 'Huila, Colombia',
    variety: 'Bourbon Rosado',
    altitude: '1.680 msnm',
    altitudeM: 1680,
    body: 'Ligero, sedoso tipo té',
    acidity: 'Brillante',
    // Perfil tomado de la etiqueta de la bolsa. Reemplázalo por las notas de
    // cata reales cuando las tengas (aparece como "Notas de sabor").
    roast: 'Tueste medio',
    flavor: 'Flores blancas, durazno, frutos amarillos y azúcar de caña',
    notes: 'Ligero y sedoso, tipo té · Acidez brillante',
    tags: ['Café de especialidad', '100% colombiano'],
    price: 45000,
    currency: 'COP',
    image: '/images/cafe-bourbon-rosado.webp',
    heroImage: '/images/cafe-bolsa-bourbon-rosado-front.webp',
    quizTags: ['floral', 'ligero', 'frutal', 'solo', 'filtro', 'aeropress'],
    description:
      'Bourbon Rosado de Pitalito, Huila, cultivado a 1.680 metros. Cuerpo ligero y sedoso, como un té, con una acidez brillante. Café de especialidad, 100% de origen colombiano, en bolsa de 250 g.',
  },
  {
    handle: 'pacamara',
    title: 'Pacamara',
    tier: 'premium', // micro-lote — peldaño alto
    tierLabel: 'Microlotes',
    origin: 'Pitalito, Huila, Colombia',
    region: 'Huila, Colombia',
    variety: 'Pacamara',
    altitude: '1.750 msnm',
    altitudeM: 1750,
    body: 'Medio-alto',
    acidity: 'Balanceada',
    roast: 'Tueste medio',
    flavor: 'Frutas tropicales, cítricos dulces, flor de azahar y panela',
    notes: 'Cuerpo medio-alto · Acidez balanceada',
    tags: ['Café de especialidad', '100% colombiano'],
    // ⚠️ PRECIO PROVISIONAL: confirmar con el negocio antes de publicar.
    price: 75000,
    currency: 'COP',
    image: '/images/cafe-pacamara.webp',
    heroImage: '/images/cafe-bolsa-pacamara-front.webp',
    quizTags: ['equilibrado', 'cuerpo', 'medio', 'ritual', 'especial', 'inmersion', 'espresso', 'leche'],
    description:
      'Pacamara de Pitalito, Huila, cultivada a 1.750 metros. Cuerpo medio-alto y acidez balanceada. Café de especialidad, 100% de origen colombiano, en bolsa de 250 g.',
  },
  {
    handle: 'tabi',
    title: 'Tabi',
    tier: 'premium',
    tierLabel: 'Microlotes',
    origin: 'Pitalito, Huila, Colombia',
    region: 'Huila, Colombia',
    variety: 'Tabi',
    altitude: '1.780 msnm',
    altitudeM: 1780,
    body: 'Medio',
    acidity: 'Media, sedosa',
    // De la etiqueta de la bolsa. `roast` y `flavor` son opcionales: el panel de
    // la tarjeta solo muestra lo que exista. Faltan en Pacamara y Bourbon Rosado.
    roast: 'Tueste medio',
    flavor: 'Frutos amarillos, chocolate blanco, vainilla y té',
    notes: 'Cuerpo medio · Acidez media y sedosa',
    tags: ['Café de especialidad', '100% colombiano'],
    // ⚠️ PRECIO PROVISIONAL: confirmar con el negocio antes de publicar.
    price: 52000,
    currency: 'COP',
    image: '/images/cafe-tabi.webp',
    heroImage: '/images/cafe-bolsa-tabi-front.webp',
    quizTags: ['equilibrado', 'medio', 'dulce', 'tarde', 'ritual', 'solo', 'endulzado', 'filtro', 'aeropress'],
    description:
      'Tabi de Pitalito, Huila, cultivado a 1.780 metros. Cuerpo medio y una acidez media, sedosa. Café de especialidad, 100% de origen colombiano, en bolsa de 250 g.',
  },
  {
    handle: 'papayo',
    title: 'Papayo',
    tier: 'special',
    tierLabel: 'Línea de Origen',
    origin: 'Pitalito, Huila, Colombia',
    region: 'Huila, Colombia',
    variety: 'Papayo',
    altitude: '1.780 msnm',
    altitudeM: 1780,
    body: 'Medio',
    acidity: 'Balanceada',
    roast: 'Tueste medio',
    flavor: 'Ciruela, té de jazmín y limoncillo',
    notes: 'Cuerpo medio · Acidez balanceada',
    tags: ['Café de especialidad', '100% colombiano'],
    // ⚠️ PRECIO PROVISIONAL: confirmar con el negocio antes de publicar.
    price: 48000,
    currency: 'COP',
    image: '/images/cafe-papayo.webp',
    heroImage: '/images/cafe-bolsa-papayo-front.webp',
    quizTags: ['equilibrado', 'medio', 'dulce', 'ritual', 'leche', 'endulzado', 'inmersion', 'espresso'],
    description:
      'Papayo de Pitalito, Huila, cultivado a 1.780 metros. Cuerpo medio y acidez balanceada. Café de especialidad, 100% de origen colombiano, en bolsa de 250 g.',
  },
  {
    handle: 'geisha',
    title: 'Geisha',
    tier: 'premium',
    tierLabel: 'Microlotes',
    origin: 'Pitalito, Huila, Colombia',
    region: 'Huila, Colombia',
    variety: 'Geisha',
    altitude: '1.580 msnm',
    altitudeM: 1580,
    body: 'Medio',
    acidity: 'Súper ligera y sedosa',
    roast: 'Tueste medio',
    flavor: 'Jazmín, té verde, mandarina y miel ligera',
    notes: 'Cuerpo medio · Acidez súper ligera y sedosa',
    tags: ['Café de especialidad', '100% colombiano'],
    // ⚠️ PRECIO PROVISIONAL: confirmar con el negocio antes de publicar.
    price: 90000,
    currency: 'COP',
    image: '/images/cafe-geisha.webp',
    heroImage: '/images/cafe-bolsa-geisha-front.webp',
    quizTags: ['floral', 'ligero', 'frutal', 'especial', 'explorar', 'solo', 'filtro', 'aeropress'],
    description:
      'Geisha de Pitalito, Huila, cultivada a 1.580 metros. Cuerpo medio y una acidez súper ligera y sedosa. Café de especialidad, 100% de origen colombiano, en bolsa de 250 g.',
  },
  {
    handle: 'caturra',
    title: 'Caturra',
    tier: 'core',
    tierLabel: 'Línea de Origen',
    origin: 'Pitalito, Huila, Colombia',
    region: 'Huila, Colombia',
    variety: 'Caturra',
    altitude: '1.580 msnm',
    altitudeM: 1580,
    body: 'Medio',
    acidity: 'Cítrica y jugosa',
    roast: 'Tueste medio',
    flavor: 'Mandarina, panela y chocolate',
    notes: 'Cuerpo medio · Acidez cítrica y jugosa',
    tags: ['Café de especialidad', '100% colombiano'],
    // ⚠️ PRECIO PROVISIONAL: confirmar con el negocio antes de publicar.
    price: 40000,
    currency: 'COP',
    image: '/images/cafe-caturra.webp',
    heroImage: '/images/cafe-bolsa-caturra-front.webp',
    quizTags: ['frutal', 'medio', 'explorar', 'tarde', 'solo', 'filtro', 'aeropress'],
    description:
      'Caturra de Pitalito, Huila, cultivado a 1.580 metros. Cuerpo medio y una acidez cítrica y jugosa. Café de especialidad, 100% de origen colombiano, en bolsa de 250 g.',
  },
  {
    handle: 'castillo-lavado',
    title: 'Castillo Lavado',
    tier: 'core',
    tierLabel: 'Línea de Origen',
    origin: 'Pitalito, Huila, Colombia',
    region: 'Huila, Colombia',
    variety: 'Castillo lavado',
    altitude: '1.580 msnm',
    altitudeM: 1580,
    body: 'Medio',
    acidity: 'Cítrica brillante',
    roast: 'Tueste medio-alto',
    flavor: 'Frutos rojos, caramelo, naranja dulce y chocolate negro',
    notes: 'Cuerpo medio · Acidez cítrica y brillante',
    tags: ['Café de especialidad', '100% colombiano'],
    // ⚠️ PRECIO PROVISIONAL: confirmar con el negocio antes de publicar.
    price: 38000,
    currency: 'COP',
    image: '/images/cafe-castillo-lavado.webp',
    heroImage: '/images/cafe-bolsa-castillo-lavado-front.webp',
    quizTags: ['frutal', 'medio', 'ritual', 'solo', 'filtro', 'espresso'],
    description:
      'Castillo lavado de Pitalito, Huila, cultivado a 1.580 metros. Cuerpo medio y una acidez cítrica y brillante. Café de especialidad, 100% de origen colombiano, en bolsa de 250 g.',
  },
];

// Bundle de lanzamiento — sube el ticket promedio (estilo "Kit tres orígenes -15%").
export const BUNDLE = {
  handle: 'kit-tres-origenes',
  title: 'Kit Tres Variedades',
  badge: '15% DCTO',
  discount: 0.15,
  includes: ['bourbon-rosado', 'pacamara', 'tabi'],
  image: '/images/kit-tres-origenes.webp',
  description:
    'Los tres cafés de Pitalito, Huila, en un solo kit: Bourbon Rosado, Pacamara y Tabi. Para probarlos lado a lado o para regalar, con 15% de descuento frente a comprarlos por separado.',
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
