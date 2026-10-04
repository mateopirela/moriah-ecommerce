/**
 * Franja fija de promesas del producto, justo debajo del hero.
 *
 * Es uno de los DOS lugares donde el sitio habla de envío y producto (el otro es la
 * barra superior: envío gratis, medios de pago y origen). Aquí va lo que la barra no
 * dice, sin repetir nada: tostado, empaque, molienda y plazo de entrega.
 */
const PROMESAS = [
  {
    icono: '/icons/icono-cafe-dorado.svg',
    titulo: 'Tostado fresco cada semana',
    detalle: 'Llega con todo su aroma',
  },
  {
    icono: '/icons/icono-empaque-dorado.svg',
    titulo: 'Sellado al vacío',
    detalle: 'Conserva el aroma hasta tu taza',
  },
  {
    icono: '/icons/icono-finca-dorado.svg',
    titulo: 'En grano o molido',
    detalle: 'Elige la molienda para tu método',
  },
  {
    icono: '/icons/icono-nacional-dorado.svg',
    titulo: 'Entrega en 2–5 días',
    detalle: 'Bogotá 2–3 días hábiles · Nacional 3–5',
  },
];

export function PromesasStrip() {
  return (
    <section className="tx-promesas" aria-label="Lo que prometemos">
      <ul className="tx-container tx-promesas__lista">
        {PROMESAS.map((p) => (
          <li className="tx-promesas__item" key={p.titulo}>
            <img src={p.icono} alt="" aria-hidden="true" width={34} height={34} loading="lazy" />
            <span>
              <strong>{p.titulo}</strong>
              <small>{p.detalle}</small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
