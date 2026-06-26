/**
 * Rotating-free announcement bar (static messages — no autoplay carousel,
 * which converts better). Communicates the free-shipping threshold and trust.
 */
export function AnnouncementBar() {
  return (
    <div className="announcement" role="region" aria-label="Anuncios">
      <span>
        Envío <strong>GRATIS</strong> en compras desde $100.000
      </span>
      <span className="announcement__sep hide-sm" aria-hidden="true" />
      <span className="hide-sm">
        Paga con <strong>Nequi, PSE o tarjeta</strong>
      </span>
      <span className="announcement__sep hide-sm" aria-hidden="true" />
      <span className="hide-sm">Café 100% colombiano de especialidad</span>
    </div>
  );
}
