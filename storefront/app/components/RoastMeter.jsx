/**
 * Visual roast-level indicator (Pergamino-style "ecualizador de tostión").
 * @param {{level?: number, label?: string}} props  level 1 (claro) … 5 (oscuro)
 */
export function RoastMeter({level = 3, label = 'Tueste Medio'}) {
  return (
    <div className="roast-meter" aria-label={`Nivel de tueste: ${label}`}>
      <span className="roast-meter__label">Tueste</span>
      <span className="roast-meter__bars" aria-hidden="true">
        {Array.from({length: 5}).map((_, i) => (
          <span
            key={i}
            className="roast-meter__bar"
            data-on={i < level}
          />
        ))}
      </span>
      <span className="roast-meter__name">{label}</span>
    </div>
  );
}
