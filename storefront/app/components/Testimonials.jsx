import {TESTIMONIALS, VERIFIED} from '~/data/testimonials';
import {StarRating} from '~/components/Icons';

/**
 * Voces de la comunidad.
 *
 * Antes este bloque se titulaba "Reseñas verificadas" y pintaba 5 estrellas
 * sobre tres testimonios escritos para la maqueta, repetidos en todos los
 * productos. Mientras `VERIFIED` sea `false` no se muestran estrellas ni se
 * afirma que estén verificadas (ver data/testimonials.js).
 *
 * @param {{title?: string, eyebrow?: string}} props
 */
export function Testimonials({
  title = 'Un café que se comparte',
  eyebrow = 'Voces de nuestra comunidad',
}) {
  if (!TESTIMONIALS.length) return null;

  return (
    <section className="tx-section tx-testimonios">
      <div className="tx-container">
        <div className="tx-testimonios__head" data-reveal>
          <span className="tx-eyebrow">{eyebrow}</span>
          <h2 className="tx-display tx-h2">{title}</h2>
        </div>
        <div className="tx-testimonios__grid" data-reveal>
          {TESTIMONIALS.map((t) => (
            <figure className="tx-testimonio" data-reveal-child key={t.name}>
              {VERIFIED && <StarRating rating={5} />}
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                {t.name} · <span>{t.city}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
