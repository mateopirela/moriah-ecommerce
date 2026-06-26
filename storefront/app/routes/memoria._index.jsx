import {redirect, data} from 'react-router';
import {useLoaderData, useActionData} from 'react-router';
import {z} from 'zod';
import {MemoryForm} from '~/components/MemoryForm';
import {IconArrowRight, IconMountain} from '~/components/Icons';

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
export async function action({request, context}) {
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
  if (context.klaviyo) {
    try {
      const upsertResult = await context.klaviyo.upsertProfile({
        email,
        firstName: nombre,
        city: ciudad,
        properties: {
          source: '/memoria',
          submitedDate: new Date().toISOString(),
        },
      });

      if (upsertResult.success) {
        await context.klaviyo.trackEvent({
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

/**
 * Memory Bank landing page.
 */
export default function MemoryBankPage() {
  const data = useLoaderData();

  return (
    <div className="memory-page">
      {/* Hero */}
      <section className="section section--dark">
        <div className="container" style={{textAlign: 'center', maxWidth: '760px'}}>
          <span className="eyebrow" style={{color: 'var(--gold-300)'}}>
            #MiPrimerTinto
          </span>
          <h1 className="display-h2">¿A qué te recuerda el olor a café?</h1>
          <p className="lede" style={{color: 'rgba(247,243,234,0.8)', textAlign: 'center'}}>
            Cada recuerdo con el café cuenta una historia. La tuya también.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="section section--cream">
        <div className="container" style={{maxWidth: '600px'}}>
          <div style={{marginBottom: '3rem'}}>
            <h2 className="display-h3" style={{marginBottom: '1rem'}}>
              El Banco de Recuerdos
            </h2>
            <p style={{fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-dark)', marginBottom: '1.5rem'}}>
              Estamos recolectando las historias de la comunidad. Las más hermosas las compartiremos
              en nuestras redes, en emails y en futuros materiales de la marca.
            </p>
            <p style={{fontSize: '0.95rem', color: 'var(--gold-400)', fontWeight: 600}}>
              Tu historia podría ser la del mes y aparecer en el reverso de nuestras bolsas.
            </p>
          </div>

          <MemoryForm />
        </div>
      </section>

      {/* Benefits */}
      <section className="section section--pine">
        <div className="container">
          <div style={{maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
            <h2 className="display-h2" style={{color: 'var(--cream-50)'}}>
              Al compartir tu historia, recibes:
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '2rem',
            }}>
              <div style={{color: 'var(--cream-50)'}}>
                <div style={{fontSize: '2rem', color: 'var(--gold-400)', marginBottom: '0.5rem'}}>10%</div>
                <p>Descuento en tu primera compra</p>
              </div>
              <div style={{color: 'var(--cream-50)'}}>
                <div style={{fontSize: '2rem', color: 'var(--gold-400)', marginBottom: '0.5rem'}}>🎁</div>
                <p>Entrada al Club de la Memoria</p>
              </div>
              <div style={{color: 'var(--cream-50)'}}>
                <div style={{fontSize: '2rem', color: 'var(--gold-400)', marginBottom: '0.5rem'}}>∞</div>
                <p>Tu historia vive para siempre aquí</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--cream">
        <div className="container" style={{textAlign: 'center', maxWidth: '640px'}}>
          <h2 className="display-h2">¿Aún no sabes cuál café es para ti?</h2>
          <p className="lede">
            Tenemos un test de 3 preguntas que te ayuda a encontrar tu match perfecto.
          </p>
          <div style={{marginTop: '2rem'}}>
            <a href="/quiz" className="btn btn--outline-gold btn--lg">
              Haz el test
              <IconArrowRight className="btn-icon" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/** @typedef {import('react-router').Route} Route */
