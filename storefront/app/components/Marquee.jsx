/**
 * Marquee dorado — banda de texto en loop infinito estilo specialty coffee.
 * Duplicamos el contenido para el loop CSS sin salto (aria-hidden en la copia).
 */
const FRASES = [
  'Un café para el alma',
  'Tostado fresco cada semana',
  '100% colombiano de especialidad',
  'Sellado al vacío',
];

export function Marquee() {
  const Grupo = ({hidden}) => (
    <div className="tx-marquee__group" aria-hidden={hidden || undefined}>
      {FRASES.map((frase) => (
        <span key={frase} className="tx-marquee__item">
          <em>{frase}</em>
          <svg
            className="tx-marquee__star"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className="tx-marquee" role="presentation">
      <div className="tx-marquee__track">
        <Grupo />
        <Grupo hidden />
      </div>
    </div>
  );
}
