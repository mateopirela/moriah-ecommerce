/**
 * MORIAH — Blog "Notas de café".
 *
 * Para publicar un artículo nuevo: agrega un objeto AL INICIO de `ARTICULOS`
 * (el más reciente va primero) y haz deploy. No hace falta tocar nada más:
 * la sección del home, /blog, la página del artículo y el sitemap se
 * alimentan de este arreglo.
 *
 * Campos:
 *  - handle:    URL del artículo (/blog/<handle>). Minúsculas y guiones, único.
 *  - title:     título (también <title> y H1).
 *  - excerpt:   resumen de 1–2 frases (tarjetas, meta description).
 *  - category:  etiqueta corta ("Preparación", "Origen", "Guía").
 *  - date:      fecha ISO 'YYYY-MM-DD'.
 *  - minutes:   minutos de lectura aproximados.
 *  - img:       imagen de portada (ruta en /public/images).
 *  - body:      bloques de contenido, en orden:
 *      {type: 'p',  text}            párrafo
 *      {type: 'h2', text}            subtítulo
 *      {type: 'ul', items: [...]}    lista con viñetas
 *      {type: 'ol', items: [...]}    lista numerada
 *      {type: 'quote', text}         cita destacada
 *
 * Tip de contenido: escribe cosas que sirvan de verdad (recetas, guías,
 * explicaciones). Evita promesas de salud o afirmaciones que no puedas
 * respaldar.
 */
export const ARTICULOS = [
  {
    handle: 'como-preparar-cafe-en-v60',
    title: 'Cómo preparar café en V60: filtrado manual paso a paso',
    excerpt:
      'Una taza limpia en 3 minutos con 15 g de café y 250 ml de agua. La receta base para empezar y ajustar a tu gusto.',
    category: 'Preparación',
    date: '2026-10-03',
    minutes: 4,
    img: '/images/blog-como-preparar-cafe-en-v60.webp',
    body: [
      {
        type: 'p',
        text: 'El filtrado manual con V60 te da control sobre cada vertido y una taza limpia y brillante. Esta es la receta base: pocas medidas y tres minutos.',
      },
      {type: 'h2', text: 'Lo que necesitas'},
      {
        type: 'ul',
        items: [
          '15 g de café, molienda media.',
          '250 ml de agua a 93 °C.',
          'Un dripper V60 y un filtro de papel V60.',
          'Balanza y temporizador.',
        ],
      },
      {type: 'h2', text: 'Paso a paso'},
      {
        type: 'ol',
        items: [
          'Preparar: coloca el filtro en el dripper y enjuágalo sobre la taza con agua caliente.',
          'Bloom: añade 15 g de café y vierte el doble en agua (30 ml). Espera 30 segundos.',
          'Primer vertido: vierte en espiral hasta los 130 ml totales.',
          'Segundo vertido: cuando el nivel baje, continúa hasta 250 ml en movimientos constantes.',
          'Disfrutar: retira el dripper en cuanto el café deje de gotear. Sirve y disfruta.',
        ],
      },
      {type: 'h2', text: 'Cómo ajustar tu taza'},
      {
        type: 'p',
        text: 'Si te sabe agria o aguada, muele un poco más fino. Si te sabe amarga o seca, muele un poco más grueso. Cambia una sola cosa a la vez y anota el resultado.',
      },
    ],
  },
  {
    handle: 'como-preparar-cafe-en-aeropress',
    title: 'Cómo preparar café en Aeropress: receta paso a paso',
    excerpt:
      'Un método rápido que prepara una taza limpia en unos 3 minutos, con café molido fino y el Aeropress en posición invertida.',
    category: 'Preparación',
    date: '2026-10-02',
    minutes: 4,
    img: '/images/blog-como-preparar-cafe-en-aeropress.webp',
    body: [
      {
        type: 'p',
        text: 'El Aeropress es rápido, fácil de limpiar y perdona los errores. Esta receta usa el método invertido y tarda unos 3 minutos en total.',
      },
      {type: 'h2', text: 'Lo que necesitas'},
      {
        type: 'ul',
        items: [
          '18 g de café, molienda fina, casi como arena (una cucharada Aeropress redondeada).',
          '200 ml de agua a 92 °C, más 50 ml de agua para completar la taza.',
          'Un Aeropress con embudo y 2 filtros de papel.',
          'Balanza y temporizador.',
        ],
      },
      {type: 'h2', text: 'Paso a paso'},
      {
        type: 'ol',
        items: [
          'Medir y moler: pesa 18 g de café y muélelo fino, casi como arena.',
          'Preparar el Aeropress: coloca el filtro y enjuágalo con agua caliente. Arma el Aeropress en posición invertida.',
          'Agregar café: agrega el café molido al Aeropress con la ayuda del embudo.',
          'Verter el agua: vierte 200 ml de agua a 92 °C en 10 segundos. Satura bien el café molido.',
          'Sellar y esperar: coloca el émbolo y crea un sello. Espera hasta el minuto 1:15.',
          'Revolver y presionar: retira el sello, revuelve y vuelve a poner el émbolo. Presiona suavemente hasta escuchar un silbido.',
        ],
      },
      {type: 'h2', text: 'Cómo ajustar tu taza'},
      {
        type: 'p',
        text: 'Si te sabe agria o aguada, muele un poco más fino. Si te sabe amarga o seca, muele un poco más grueso. Los 50 ml de agua extra sirven para ajustar la intensidad a tu gusto.',
      },
    ],
  },
  {
    handle: 'como-preparar-cafe-en-prensa-francesa',
    title: 'Cómo preparar café en prensa francesa: receta paso a paso',
    excerpt:
      'Una taza con más cuerpo en 4 minutos: molienda gruesa, 30 g de café y 500 ml de agua.',
    category: 'Preparación',
    date: '2026-10-01',
    minutes: 3,
    img: '/images/blog-como-preparar-cafe-en-prensa-francesa.webp',
    body: [
      {
        type: 'p',
        text: 'La prensa francesa deja el café en contacto con el agua todo el tiempo y da una taza con más cuerpo y textura. Es el método más simple: solo hay que cuidar la molienda y el tiempo.',
      },
      {type: 'h2', text: 'Lo que necesitas'},
      {
        type: 'ul',
        items: [
          '30 g de café, molienda gruesa.',
          '500 ml de agua a 92 °C.',
          'Una prensa francesa y una cuchara de madera.',
          'Balanza y temporizador.',
        ],
      },
      {type: 'h2', text: 'Paso a paso'},
      {
        type: 'ol',
        items: [
          'Pre-calentar: llena la prensa con agua caliente, espera un minuto y bota el agua.',
          'Café y agua: añade 30 g de café molido grueso y vierte 500 ml de agua a 92 °C.',
          'Revolver: revuelve suavemente con una cuchara de madera.',
          'Tapar y esperar: coloca la tapa sin presionar. Espera 4 minutos exactos.',
          'Presionar y servir: presiona el émbolo lentamente y sirve de inmediato para evitar sobreextracción.',
        ],
      },
      {type: 'h2', text: 'Cómo ajustar tu taza'},
      {
        type: 'p',
        text: 'Si te sabe amarga o seca, muele un poco más grueso o sirve apenas termines de presionar. Si te sabe aguada, muele un poco más fino. Cambia una sola cosa a la vez.',
      },
    ],
  },

  {
    handle: 'como-preparar-cafe-en-chemex',
    title: 'Cómo preparar café en Chemex: receta paso a paso',
    excerpt:
      'Una taza limpia, dulce y brillante con solo tres variables: molienda, proporción y paciencia. Esta es la receta que usamos en casa.',
    category: 'Preparación',
    date: '2026-09-30',
    minutes: 5,
    img: '/images/blog-como-preparar-cafe-en-chemex.webp',
    body: [
      {
        type: 'p',
        text: 'La Chemex usa un filtro grueso que retiene los aceites y los sedimentos. El resultado es una taza muy limpia, de cuerpo ligero y acidez clara, ideal para destacar las notas de un café de especialidad.',
      },
      {type: 'h2', text: 'Lo que necesitas'},
      {
        type: 'ul',
        items: [
          '30 g de café recién molido, molienda media-gruesa (como sal de mar).',
          '500 ml de agua filtrada a 94 °C aproximadamente.',
          'Una Chemex y su filtro.',
          'Balanza y temporizador (el celular sirve).',
        ],
      },
      {type: 'h2', text: 'Paso a paso'},
      {
        type: 'ol',
        items: [
          'Dobla el filtro con la parte de tres capas hacia el pico, colócalo y enjuágalo con agua caliente. Desecha esa agua.',
          'Agrega los 30 g de café y nivela la cama con un golpecito suave.',
          'Bloom: vierte unos 60 ml de agua, cubriendo todo el café, y espera 45 segundos. Verás cómo el café "respira" y sube.',
          'Vierte el resto del agua en espirales lentas desde el centro hacia afuera, hasta completar 500 ml.',
          'Cuando termine de gotear (entre 4 y 5 minutos en total), retira el filtro y sirve.',
        ],
      },
      {type: 'h2', text: 'Cómo ajustar tu taza'},
      {
        type: 'p',
        text: 'Si te sabe agria o salada, el café quedó subextraído: muele un poco más fino. Si te sabe amarga o seca, está sobreextraído: muele un poco más grueso. Cambia una sola cosa a la vez y anota el resultado.',
      },
      {
        type: 'quote',
        text: 'La mejor receta es la que repites. Mide siempre, y tu taza será consistente.',
      },
    ],
  },
  {
    handle: 'como-guardar-tu-cafe-en-casa',
    title: 'Cómo guardar tu café para que dure fresco',
    excerpt:
      'El café tostado se apaga con el aire, la luz, el calor y la humedad. Cuatro hábitos simples para proteger su aroma.',
    category: 'Guía',
    date: '2026-09-16',
    minutes: 4,
    img: '/images/blog-como-guardar-tu-cafe-en-casa.webp',
    body: [
      {
        type: 'p',
        text: 'Después del tostado, el café empieza a perder aroma poco a poco. No se "daña" de un día para otro, pero sí se va apagando. La buena noticia: guardarlo bien es fácil.',
      },
      {type: 'h2', text: 'Los cuatro enemigos del café'},
      {
        type: 'ul',
        items: [
          'Oxígeno: mantén la bolsa bien cerrada y saca el aire antes de sellarla.',
          'Luz: guárdalo en un lugar oscuro, dentro de su empaque o un frasco opaco.',
          'Calor: lejos de la estufa, el horno o una ventana soleada.',
          'Humedad: nunca uses cucharas mojadas ni lo guardes cerca del fregadero.',
        ],
      },
      {type: 'h2', text: '¿Grano o molido?'},
      {
        type: 'p',
        text: 'El café en grano conserva su aroma más tiempo porque expone menos superficie al aire. Si tienes molino en casa, muele solo lo que vas a usar. Si lo prefieres molido, pídelo para tu método de preparación y consúmelo con calma en las primeras semanas.',
      },
      {type: 'h2', text: '¿Nevera o congelador?'},
      {
        type: 'p',
        text: 'Para el uso diario, no lo recomendamos: la humedad y los olores de la nevera se le pegan al café. Un sitio fresco, seco y oscuro de la despensa es lo mejor.',
      },
    ],
  },
  {
    handle: 'que-es-el-cafe-pacamara',
    title: 'Pacamara: la variedad que cautiva a los catadores',
    excerpt:
      'Nació de un cruce entre Pacas y Maragogipe y se cultiva con esmero en las montañas del Huila. Conoce qué la hace especial.',
    category: 'Origen',
    date: '2026-09-02',
    minutes: 4,
    img: '/images/blog-que-es-el-cafe-pacamara.webp',
    body: [
      {
        type: 'p',
        text: 'Pacamara es una variedad de café arábica creada en El Salvador, a partir del cruce de Pacas (una mutación del Bourbon) con Maragogipe. Se reconoce por el tamaño de su grano, notablemente más grande que el de otras variedades.',
      },
      {type: 'h2', text: 'Qué esperar en la taza'},
      {
        type: 'p',
        text: 'Suele describirse como un café complejo, con acidez brillante y mucha presencia de aromas. Cada lote es distinto, porque el suelo, la altura y el proceso de beneficio le dejan su huella. En nuestra bolsa de Pacamara, de Pitalito (Huila, a 1.750 msnm), encontrarás un perfil de cuerpo medio-alto y acidez balanceada.',
      },
      {type: 'h2', text: 'Por qué importa la altura'},
      {
        type: 'p',
        text: 'A mayor altura, el fruto madura más lento. Esa maduración pausada concentra azúcares y desarrolla acidez más fina, dos rasgos muy valorados en el café de especialidad.',
      },
      {
        type: 'p',
        text: 'Detrás de cada bolsa hay una familia caficultora y una tierra que da lo mejor de sí. Esa es la razón por la que contamos de dónde viene lo que te sirves.',
      },
    ],
  },
  {
    handle: 'molienda-del-cafe-guia-rapida',
    title: 'Molienda del café: guía rápida por método',
    excerpt:
      'La molienda decide cuánto sabor sale del café. Una tabla simple para acertar según tu forma de preparar.',
    category: 'Guía',
    date: '2026-08-19',
    minutes: 3,
    img: '/images/blog-molienda-del-cafe-guia-rapida.webp',
    body: [
      {
        type: 'p',
        text: 'Cuanto más fino es el molido, más rápido se extrae el café; cuanto más grueso, más lento. Elegir bien la molienda para tu método es la forma más fácil de mejorar tu taza.',
      },
      {type: 'h2', text: 'Punto de partida por método'},
      {
        type: 'ul',
        items: [
          'Aeropress: fina a media-fina, como arena.',
          'Filtrado manual (V60): media, como sal fina.',
          'Chemex: media-gruesa, como sal de mar.',
          'Prensa francesa: gruesa, como sal gruesa.',
        ],
      },
      {type: 'h2', text: 'Cómo corregir'},
      {
        type: 'p',
        text: 'Si el café sabe agrio o aguado, muele más fino. Si sabe amargo o astringente, muele más grueso. Son puntos de partida: cada café y cada molino son un poco distintos, y ahí está parte de la gracia.',
      },
    ],
  },
];

/** @param {string} handle */
export function getArticulo(handle) {
  return ARTICULOS.find((a) => a.handle === handle) ?? null;
}

/** Artículos más recientes primero (por si se agregan fuera de orden). */
export function articulosOrdenados() {
  return [...ARTICULOS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** '2026-09-30' → '30 de septiembre de 2026' (sin depender de la zona horaria). */
export function formatFecha(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}
