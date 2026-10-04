/**
 * MORIAH — "Encuentra tu café": preguntas, etiquetas y resultado.
 *
 * Cómo funciona: cada respuesta lleva `tags` y cada pregunta un `weight`
 * (qué tanto pesa). Cada café del catálogo declara sus `quizTags` en
 * app/data/cafes.js. Por cada etiqueta de la respuesta que el café tenga,
 * suma el peso de la pregunta. Gana el café con más puntos.
 *
 * Por eso agregar, quitar o cambiar cafés NO requiere tocar este archivo:
 * solo hay que poner bien los `quizTags` del café nuevo.
 *
 * Para editar preguntas: cambia los textos o las etiquetas. Etiquetas
 * disponibles (úsalas tal cual, en minúscula):
 *   sabor   → dulce · frutal · floral · equilibrado
 *   cuerpo  → ligero · medio · cuerpo
 *   momento → ritual · tarde · especial · explorar
 *   toma    → solo · leche · endulzado
 *   método  → filtro · inmersion · espresso · aeropress
 * En la pregunta del método, `grind` (uno de `GRINDS`) y `guide` (handle del
 * artículo de receta en /blog) definen la receta que se le muestra.
 */
import {CAFES, GRINDS} from '~/data/cafes';

const [G_ENTERO, G_MEDIA, G_FINA, G_GRUESA] = GRINDS;

export const QUESTIONS = [
  {
    key: 'metodo',
    weight: 1,
    q: '¿Cómo preparas tu café?',
    hint: 'Así te recomendamos la molienda correcta.',
    options: [
      {
        label: 'Aeropress',
        sub: 'Rápido y limpio',
        grind: G_FINA,
        guide: 'como-preparar-cafe-en-aeropress',
        tags: ['aeropress'],
      },
      {
        label: 'Chemex',
        sub: 'Filtrado, taza brillante',
        grind: G_MEDIA,
        guide: 'como-preparar-cafe-en-chemex',
        tags: ['filtro'],
      },
      {
        label: 'Filtrado manual (V60)',
        sub: 'Goteo con control',
        grind: G_MEDIA,
        guide: 'como-preparar-cafe-en-v60',
        tags: ['filtro'],
      },
      {
        label: 'Prensa francesa',
        sub: 'Cuerpo y textura',
        grind: G_GRUESA,
        guide: 'como-preparar-cafe-en-prensa-francesa',
        tags: ['inmersion'],
      },
      {
        label: 'Espresso o moka',
        sub: 'Intenso y concentrado',
        grind: G_FINA,
        guide: null,
        tags: ['espresso'],
      },
      {
        label: 'Lo muelo yo en casa',
        sub: 'Prefiero el grano entero',
        grind: G_ENTERO,
        guide: null,
        tags: [],
      },
    ],
  },
  {
    key: 'sabor',
    weight: 3,
    q: '¿Qué sabores te llaman más?',
    hint: 'No hay respuesta mala: elige lo que se te antoja.',
    options: [
      {
        label: 'Chocolate y dulce',
        sub: 'Redondo, como postre',
        tags: ['dulce'],
      },
      {
        label: 'Frutal y brillante',
        sub: 'Cítrico, uva, jugoso',
        tags: ['frutal'],
      },
      {
        label: 'Floral y delicado',
        sub: 'Aromático, casi un té',
        tags: ['floral'],
      },
      {
        label: 'Equilibrado',
        sub: 'Que le guste a todos',
        tags: ['equilibrado'],
      },
    ],
  },
  {
    key: 'cuerpo',
    weight: 2,
    q: '¿Cómo te gusta sentirlo en la boca?',
    hint: 'El cuerpo es qué tan "espeso" se siente la taza.',
    options: [
      {
        label: 'Ligero y limpio',
        sub: 'Fresco, se toma fácil',
        tags: ['ligero'],
      },
      {
        label: 'Medio, redondo',
        sub: 'Ni muy suave ni muy fuerte',
        tags: ['medio'],
      },
      {
        label: 'Con cuerpo',
        sub: 'Intenso y con presencia',
        tags: ['cuerpo'],
      },
    ],
  },
  {
    key: 'momento',
    weight: 2,
    q: '¿Para qué momento lo quieres?',
    hint: 'Cada café tiene su hora.',
    options: [
      {
        label: 'Mi ritual de cada mañana',
        sub: 'El que me acompaña siempre',
        tags: ['ritual'],
      },
      {
        label: 'Una pausa en la tarde',
        sub: 'Para desconectar un rato',
        tags: ['tarde'],
      },
      {
        label: 'Algo especial o para regalar',
        sub: 'Una ocasión que lo merece',
        tags: ['especial'],
      },
      {
        label: 'Quiero explorar y aprender',
        sub: 'Probar cosas nuevas',
        tags: ['explorar'],
      },
    ],
  },
  {
    key: 'toma',
    weight: 1,
    q: '¿Cómo lo tomas?',
    hint: 'Última pregunta.',
    options: [
      {
        label: 'Solo, tal cual',
        sub: 'Sin nada',
        tags: ['solo'],
      },
      {
        label: 'Con un toque de leche',
        sub: 'Suave y cremoso',
        tags: ['leche'],
      },
      {
        label: 'Con azúcar o endulzado',
        sub: 'Más dulce',
        tags: ['endulzado'],
      },
    ],
  },
];

/** Los índices de respuesta viajan en la URL como "20112" (un dígito por pregunta). */
export function encodeAnswers(indices) {
  return indices.join('');
}

/** @returns {number[] | null} null si el texto no es una combinación válida. */
export function decodeAnswers(text) {
  if (typeof text !== 'string' || text.length !== QUESTIONS.length) return null;
  const out = [];
  for (let i = 0; i < QUESTIONS.length; i += 1) {
    const n = Number(text[i]);
    if (!Number.isInteger(n) || n < 0 || n >= QUESTIONS[i].options.length) return null;
    out.push(n);
  }
  return out;
}

/**
 * Calcula el café recomendado, dos alternativas y la receta del método.
 * Desempate: el orden del catálogo (los primeros tienen prioridad).
 * @param {number[]} indices
 */
export function computeResult(indices) {
  const picks = indices.map((optIdx, qIdx) => ({
    opt: QUESTIONS[qIdx].options[optIdx],
    weight: QUESTIONS[qIdx].weight ?? 1,
  }));
  const scoreOf = (cafe) => {
    const have = new Set(cafe.quizTags ?? []);
    return picks.reduce(
      (sum, {opt, weight}) =>
        sum + opt.tags.reduce((n, tag) => n + (have.has(tag) ? weight : 0), 0),
      0,
    );
  };
  const ranked = [...CAFES].sort(
    (a, b) => scoreOf(b) - scoreOf(a) || CAFES.indexOf(a) - CAFES.indexOf(b),
  );
  const [cafe, ...rest] = ranked;
  const method = picks[0].opt;
  return {
    cafe,
    alternatives: rest.slice(0, 2),
    method: {label: method.label, grind: method.grind, guide: method.guide},
  };
}
