/**
 * MORIAH — contenido de /conocenos ("La historia de Moriah Café").
 * Todo el texto de la página sale de este archivo: edítalo aquí.
 *
 * Dato que falta (la página lo oculta mientras esté vacío):
 *   - FUNDADOR.nombre            → firma al final de la historia
 *
 * ⚠️ Por confirmar antes de publicar:
 *   - Las fotos de la abuela y de la casa: derechos de uso y que correspondan
 *     a la historia (la casa parece de otro país).
 *
 * Los capítulos "Lo que hay en tu taza" y "Detrás de cada bolsa" se quitaron por
 * ahora. Si quieres volver a ponerlos, agrégalos a CAPITULOS con un `id` nuevo.
 */

export const SEO = {
  title: 'Conócenos | Moriah, café de especialidad colombiano',
  description:
    'Moriah nació del primer tinto en la cocina de una abuela. Café de especialidad de las montañas de Colombia, para volver a hacer la pausa en casa.',
};

export const HERO = {
  titulo: 'La historia de Moriah Café',
  frase: 'Yo no aprendí a querer el café. Lo heredé.',
  lectura: '3 min de lectura',
  /** Línea de autoría bajo el título (usa FUNDADOR.nombre). */
  img: '/images/conocenos-manos.webp',
  alt: 'Manos de una abuela descansando sobre su regazo',
};

/** Capítulos de la historia, en orden. `corto` es el nombre en el índice.
 *  `foto` (opcional): {src, alt, lado: 'izq' | 'der'}. `cta` (opcional): botón al final. */
export const CAPITULOS = [
  {
    id: 'casa',
    corto: 'La casa',
    titulo: 'Una casa, a las seis de la mañana',
    parrafos: [
      'Para mí el café huele a una hora exacta. Las seis de la mañana, la luz apenas entrando por la ventana y la voz de mi abuela llamando a la mesa.',
      'De niño yo no tomaba tinto, pero igual me acercaba a la cocina. El olor llenaba la casa entera y, de repente, aparecían todos: mi abuela, mis tíos, mi mamá. El tinto se servía en pocillo de peltre, recién colado, mientras el día apenas despertaba.',
    ],
    cita: 'Nadie lo decía en voz alta, pero ese olor era la señal de que estábamos juntos.',
    despues: [
      'Creo que en casi todas las casas de Colombia hay una escena parecida. Cambian la cocina, el pueblo o la ciudad, pero el tinto de la mañana es el mismo.',
    ],
    foto: {
      src: '/images/conocenos-casa.webp',
      alt: 'Fachada blanca de una casa con una cortina de cintas en la puerta y dos sillas afuera',
      lado: 'der',
    },
  },
  {
    id: 'prisa',
    corto: 'La prisa',
    titulo: 'Después llegó la prisa',
    parrafos: [
      'Crecí y me fui de la casa. Llegaron las reuniones, las pantallas, el tráfico. El café siguió conmigo, pero cambió de oficio y se volvió combustible: un vaso desechable que uno se toma de pie, camino a lo siguiente.',
      'Un día me quedé mirando la taza y entendí qué se me había perdido. Era esa hora del día en que todos dejaban lo que estaban haciendo y se miraban.',
    ],
  },
  {
    id: 'nacio',
    corto: 'Moriah',
    titulo: 'Por eso nació Moriah',
    destacado:
      'Moriah existe para devolverle al café su lugar en la mesa. Es un café de especialidad para tomarse despacio y en compañía, como se tomaba en la casa de los abuelos.',
  },
  {
    id: 'nombre',
    corto: 'El nombre',
    titulo: 'Por qué se llama Moriah',
    parrafos: [
      'Moriah significa “el lugar de la provisión”. Es un lugar al que se sube, donde se da lo mejor y donde se confía en que la tierra responde.',
      'Así se hace el café colombiano. Crece en la montaña, lo cuidan familias que empiezan a trabajar antes de que salga el sol y, cosecha tras cosecha, la tierra provee. Lo mejor de ese trabajo llega a tu mesa con el nombre de Moriah.',
    ],
    foto: {
      src: '/images/origen-finca.webp',
      alt: 'Caficultor con cerezas de café maduras recién recogidas en un balde',
      lado: 'izq',
    },
    cta: {texto: 'Prueba el café de esta historia', to: '/collections/cafes'},
  },
];

export const FUNDADOR = {
  /** Nombre del fundador. Mientras sea null, la firma no se muestra. */
  nombre: 'Rafael Delafiut',
};

export const COMUNIDAD = {
  etiqueta: '#MiPrimerTinto',
  titulo: '¿A qué te huele a ti el café?',
  texto: [
    'Esta historia empezó en la cocina de mi abuela, y seguramente el tinto también reunió a tu familia.',
    'Cuéntanos tu primer recuerdo con el café usando #MiPrimerTinto. Las historias más bonitas las compartiremos con toda la comunidad.',
  ],
  /** Página para compartir la historia (formulario #MiPrimerTinto del sitio). */
  url: '/memoria',
};

export const CIERRE = 'Un café para el alma.';
