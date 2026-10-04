import {Link} from 'react-router';

/**
 * "Del origen a tu taza": tres pasos con foto y un dato concreto cada uno.
 * Para cambiar una foto, reemplaza el archivo en /public/images (mismo nombre,
 * proporción 4:5, mínimo 1000×1250) o cambia `img` aquí.
 * Los datos de altura salen de las etiquetas de las bolsas.
 */
const PASOS = [
  {
    n: '01',
    title: 'La finca',
    dato: 'Pitalito, Huila · 1.680–1.780 msnm',
    texto:
      'Nuestros cafés vienen de las montañas del Huila, donde la altura le da dulzor y acidez a cada taza.',
    // Confirmar los derechos de uso de esta foto (propia o con licencia) antes de publicar.
    img: '/images/origen-finca.webp',
    alt: 'Caficultor con cerezas de café maduras recién recogidas en un balde',
  },
  {
    n: '02',
    title: 'El tostado',
    dato: 'Tostado fresco cada semana',
    texto: 'Tostamos cada semana y sellamos al vacío para que el aroma llegue intacto a tu casa.',
    img: '/images/origen-tostado.webp',
    alt: 'Granos de café recién tostados en la tostadora',
  },
  {
    n: '03',
    title: 'Tu taza',
    dato: 'Entrega en 2–5 días',
    texto: 'Pídelo en grano o molido para tu método: Chemex, V60, Aeropress o prensa francesa.',
    img: '/images/origen-taza.webp',
    alt: 'Café recién colado sirviéndose en una taza',
  },
];

export function OrigenSection() {
  return (
    <section className="tx-origen" aria-labelledby="origen-title">
      <div className="tx-container">
        <header className="tx-origen__head" data-reveal>
          <span className="tx-eyebrow">Del origen a tu taza</span>
          <h2 id="origen-title" className="tx-display tx-h2">
            Así llega el café a tu casa
          </h2>
        </header>

        <ol className="tx-origen__pasos" data-reveal>
          {PASOS.map((p) => (
            <li className="tx-origen__paso" key={p.n} data-reveal-child>
              <div className="tx-origen__foto">
                <img src={p.img} alt={p.alt} width={500} height={625} loading="lazy" />
                <span className="tx-origen__num" aria-hidden="true">
                  {p.n}
                </span>
              </div>
              <h3 className="tx-origen__title">{p.title}</h3>
              <p className="tx-origen__dato">{p.dato}</p>
              <p className="tx-origen__texto">{p.texto}</p>
            </li>
          ))}
        </ol>

        <div className="tx-origen__cta" data-reveal>
          <Link className="tx-btn" to="/conocenos">
            Conoce nuestra historia
          </Link>
          <Link className="tx-origen__link" to="/collections/cafes">
            Ver nuestros cafés →
          </Link>
        </div>
      </div>
    </section>
  );
}
