/**
 * MORIAH — línea de merch ("Para vestir y para el ritual").
 *
 * Cada pieza es una extensión del léxico del manifiesto (pausa, abundancia,
 * afán, verdad, legado). No es merch decorativo: es el manifiesto hecho objeto.
 * Se usa como catálogo local mientras Shopify no tenga la colección `merch`.
 */

export const MERCH = [
  {
    handle: 'caja-el-legado',
    title: 'Caja El Legado',
    category: 'caja-regalo',
    badge: 'Regalo insignia',
    price: 220000,
    image: '/images/kit-bolsas.webp',
    short: 'Molino + pocillo + café. La herramienta para heredar una tradición.',
    description:
      'El nombre definitivo para tu producto estrella de regalo. Al entregar el molino, el pocillo y el café, estás entregando la herramienta para heredar una tradición.',
  },
  {
    handle: 'pocillo-de-verdad',
    title: 'Pocillo De Verdad',
    category: 'pocillos',
    badge: 'El ritual',
    price: 58000,
    image: '/images/producto-bolsa.webp',
    short: 'No es un mug genérico de oficina. Es el contenedor de un ritual real.',
    description:
      'Inspirado en la promesa del manifiesto de "compartir un tinto de verdad". No es un mug genérico de oficina, es el contenedor de un ritual real.',
  },
  {
    handle: 'tote-bag-abundancia',
    title: 'Tote Bag Abundancia',
    category: 'accesorios',
    badge: 'Para cargar lo que importa',
    price: 75000,
    image: '/images/cafe-cafes.webp',
    short: 'Un guiño a "la abundancia de esas mañanas".',
    description:
      'Un guiño sutil a "la abundancia de esas mañanas", ideal para cargar todo lo que importa en el día a día.',
  },
  {
    handle: 'gorra-la-pausa',
    title: 'Gorra La Pausa',
    category: 'para-vestir',
    badge: 'Baja la velocidad',
    price: 120000,
    image: '/images/tostado-moriah.webp',
    short: 'Cubrirse del sol y recordarse que está bien bajar la velocidad.',
    description:
      'El accesorio perfecto para cubrirse del sol y recordarse a uno mismo (y al mundo) que está bien bajar la velocidad.',
  },
  {
    handle: 'sueter-el-afan',
    title: 'Suéter El Afán',
    category: 'para-vestir',
    badge: 'Desconéctate',
    price: 185000,
    image: '/images/equipo-moriah.webp',
    short: 'La prenda que te pones para protegerte del afán de las pantallas.',
    description:
      'La ironía perfecta; la prenda que te pones precisamente para protegerte y desconectarte del afán de las pantallas y las reuniones de la ciudad.',
  },
];

/** Categorías para el menú de navegación (estilo Tropicalia → "Merch"). */
export const MERCH_CATEGORIES = [
  {handle: 'pocillos', title: 'Pocillos'},
  {handle: 'para-vestir', title: 'Para vestir'},
  {handle: 'accesorios', title: 'Accesorios'},
  {handle: 'caja-regalo', title: 'Caja regalo'},
];

/** @param {string} handle */
export function getMerch(handle) {
  return MERCH.find((m) => m.handle === handle) || null;
}
