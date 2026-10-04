import {Link} from 'react-router';

/**
 * "¿Primera vez con café de especialidad?": tres pasos para quien no sabe por
 * dónde empezar. Lleva al quiz (elegir), a la guía de molienda y a las recetas.
 */
const PASOS = [
  {
    n: '1',
    titulo: 'Elige',
    texto: 'Responde unas preguntas y te decimos qué café va con tu gusto y tu forma de prepararlo.',
    cta: 'Hacer el quiz',
    to: '/quiz',
  },
  {
    n: '2',
    titulo: 'Muele',
    texto:
      'El grano entero conserva mejor el aroma. Si no tienes molino, pídelo molido para tu método.',
    cta: 'Guía de molienda',
    to: '/blog/molienda-del-cafe-guia-rapida',
  },
  {
    n: '3',
    titulo: 'Prepara',
    texto: 'V60, Aeropress, prensa francesa o Chemex: recetas paso a paso, sin complicarte.',
    cta: 'Ver recetas',
    to: '/blog?categoria=Preparaci%C3%B3n',
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
              <span className="tx-primera__num" aria-hidden="true">
                {p.n}
              </span>
              <h3 className="tx-primera__titulo">{p.titulo}</h3>
              <p className="tx-primera__texto">{p.texto}</p>
              <Link className="tx-primera__cta" to={p.to}>
                {p.cta} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
