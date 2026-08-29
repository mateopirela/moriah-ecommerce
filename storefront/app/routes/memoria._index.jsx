import {Link, redirect, data} from 'react-router';
import {z} from 'zod';
import {MemoryForm} from '~/components/MemoryForm';
import {getKlaviyo} from '~/lib/klaviyo.server';
import {IconArrowRight, IconGift, IconMountain} from '~/components/Icons';

export const meta = () => [
  {title: 'Comparte tu primer tinto · #MiPrimerTinto'},
  {
    name: 'description',
    content:
      '¿A qué te recuerda el olor a café? Comparte tu historia y únete al Banco de Recuerdos de MORIAH.',
  },
];

/**
 * Validation schema for memory form submission.
 * Server-side validation enforces boundaries.
 */
const MemorySubmissionSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor, ingresa un correo válido'),
  ciudad: z.string().optional().default(''),
  historia: z.string()
    .min(50, 'La historia debe tener al menos 50 caracteres')
    .max(5000, 'La historia no puede exceder 5000 caracteres'),
  consent: z.enum(['on'], {errorMap: () => ({message: 'Debes consentir para compartir tu historia'})}),
});

/**
 * Loader: Return static page data (no interactive state).
 */
export async function loader() {
  return data({
    discount_code: 'MIPRIMERTINTO10',
    discount_percent: 10,
  });
}

/**
 * Action: Handle form submission.
 * - Validate with Zod
 * - Track event in Klaviyo (if available)
 * - Redirect to confirmation page
 */
export async function action({request}) {
  const klaviyo = getKlaviyo();
  if (request.method !== 'POST') {
    return data({errors: {general: 'Method not allowed'}}, {status: 405});
  }

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  // Validate
  const result = MemorySubmissionSchema.safeParse(values);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const flatErrors = {};
    Object.entries(errors).forEach(([key, messages]) => {
      flatErrors[key] = messages?.[0] || 'Error';
    });
    return data({errors: flatErrors, values}, {status: 422});
  }

  const {nombre, email, ciudad, historia, consent} = result.data;

  // Track in Klaviyo (gracefully degrade if not available)
  if (klaviyo) {
    try {
      const upsertResult = await klaviyo.upsertProfile({
        email,
        firstName: nombre,
        city: ciudad,
        properties: {
          source: '/memoria',
          submitedDate: new Date().toISOString(),
        },
      });

      if (upsertResult.success) {
        await klaviyo.trackEvent({
          metric: {name: 'Story Submitted'},
          profile: {email},
          properties: {
            story: historia.substring(0, 500), // Truncate for storage
            ciudad,
            prompt: '#MiPrimerTinto',
            source: '/memoria',
            consentGiven: consent === 'on',
          },
        });
      }
    } catch (err) {
      console.error('Klaviyo tracking error:', err);
      // Non-fatal: user experience continues even if Klaviyo fails
    }
  }

  // Redirect to thank-you page with discount code
  return redirect(`/memoria/gracias?code=${encodeURIComponent('MIPRIMERTINTO10')}`);
}


/** Página del Banco de Recuerdos (#MiPrimerTinto). */
export default function MemoryBankPage() {
  return (
    <div className="memory-page">
      {/* Hero */}
      <section className="section section--dark">
        <div className="container memory-hero">
          <span className="eyebrow eyebrow--on-dark">#MiPrimerTinto</span>
          <h1 className="display-h2">¿A qué te recuerda el olor a café?</h1>
          <p className="lede lede--on-dark">
            Cada recuerdo con el café cuenta una historia. La tuya también.
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section className="section section--cream">
        <div className="container memory-form-wrap">
          <div className="memory-form-intro">
            <h2 className="display-h3">El Banco de Recuerdos</h2>
            <p>
              Estamos recolectando las historias de la comunidad. Las más hermosas las
              compartiremos en nuestras redes, en emails y en futuros materiales de la marca.
            </p>
            <p className="memory-form-intro__note">
              Tu historia podría ser la del mes y aparecer en el reverso de nuestras bolsas.
            </p>
          </div>

          <MemoryForm />
        </div>
      </section>

      {/* Beneficios */}
      <section className="section section--pine">
        <div className="container memory-benefits">
          <h2 className="display-h2">Al compartir tu historia, recibes:</h2>
          <ul className="memory-benefits__grid">
            <li>
              <span className="memory-benefits__figure" aria-hidden="true">
                10%
              </span>
              <p>Descuento en tu primera compra</p>
            </li>
            <li>
              <span className="memory-benefits__figure" aria-hidden="true">
                <IconGift width={34} height={34} />
              </span>
              <p>Entrada al Club de la Memoria</p>
            </li>
            <li>
              <span className="memory-benefits__figure" aria-hidden="true">
                <IconMountain width={34} height={34} />
              </span>
              <p>Tu historia vive para siempre aquí</p>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--cream">
        <div className="container memory-cta">
          <h2 className="display-h2">¿Aún no sabes cuál café es para ti?</h2>
          <p className="lede">
            Tenemos un test de 3 preguntas que te ayuda a encontrar tu match perfecto.
          </p>
          <Link to="/quiz" className="btn btn--lg">
            Haz el test
            <IconArrowRight className="btn-icon" />
          </Link>
        </div>
      </section>
    </div>
  );
}
