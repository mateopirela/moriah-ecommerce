import {Link} from 'react-router';

/**
 * "¿Primera vez con café de especialidad?": tres pasos para quien no sabe por
 * dónde empezar. Cada paso lleva una foto, un consejo corto y un enlace; al final,
 * un botón al quiz para quien prefiere que le recomendemos.
 */
const PASOS = [
  {
    n: '1',
    titulo: 'Elige',
    texto: 'Responde unas preguntas y te decimos qué café va con tu gusto y tu forma de prepararlo.',
    consejo: 'No hay respuestas malas: el quiz solo te guía.',
    cta: 'Hacer el quiz',
    to: '/quiz',
    img: '/images/primera-elige.webp',
    alt: 'Bolsas de café MORIAH de distintos colores',
  },
  {
    n: '2',
    titulo: 'Muele',
    texto: 'El grano entero conserva mejor el aroma. Si no tienes molino, pídelo molido para tu método.',
    consejo: 'Media para goteo y V60, fina para espresso, gruesa para prensa francesa.',
    cta: 'Guía de molienda',
    to: '/blog/molienda-del-cafe-guia-rapida',
    img: '/images/primera-muele.webp',
    alt: 'Granos de café siendo molidos',
  },
  {
    n: '3',
    titulo: 'Prepara',
    texto: 'V60, Aeropress, prensa francesa o Chemex: recetas paso a paso, sin complicarte.',
    consejo: 'Un buen punto de partida: unos 15 g de café por cada 250 ml de agua.',
    cta: 'Ver recetas',
    to: '/blog?categoria=Preparaci%C3%B3n',
    img: '/images/primera-prepara.webp',
    alt: 'Café preparado en V60',
  },
];

export function PrimeraVez() {
  return (
    <section className="tx-primera" aria-labelledby="primera-title">
      <div className="tx-container">
        <header className="tx-primera__head" data-reveal>
          <span className="tx-eyebrow">Empieza aquí</span>
          <h2 id="primera-title" className="tx-display tx-h2">
            ¿Primera vez con café de especialidad?
          </h2>
          <p>No necesitas saber de café. Son tres pasos.</p>
        </header>

        <ol className="tx-primera__pasos" data-reveal>
          {PASOS.map((p) => (
            <li className="tx-primera__paso" key={p.n} data-reveal-child>
              <Link className="tx-primera__foto" to={p.to} tabIndex={-1} aria-hidden="true">
                <img src={p.img} alt="" width={640} height={460} loading="lazy" />
                <span className="tx-primera__num">{p.n}</span>
              </Link>
              <div className="tx-primera__cuerpo">
                <h3 className="tx-primera__titulo">{p.titulo}</h3>
                <p className="tx-primera__texto">{p.texto}</p>
                <p className="tx-primera__consejo">
                  <strong>Tip:</strong> {p.consejo}
                </p>
                <Link className="tx-primera__cta" to={p.to}>
                  {p.cta} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <div className="tx-primera__cierre" data-reveal>
          <Link className="tx-btn" to="/quiz">
            Encuentra mi café
          </Link>
          <span>Toma menos de un minuto.</span>
        </div>
      </div>
    </section>
  );
}
