import {useSearchParams} from 'react-router';
import {Link} from 'react-router';
import {IconArrowRight, IconCheck} from '~/components/Icons';

export const meta = () => [
  {title: '¡Gracias! Tu historia es valiosa'},
  {name: 'description', content: 'Tu memoria ha sido recibida. Aquí está tu código de descuento.'},
];

/**
 * Thank-you page after memory form submission.
 * Displays discount code and next steps.
 */
export default function GraciasPage() {
  const [params] = useSearchParams();
  const discountCode = params.get('code') || 'MIPRIMERTINTO10';

  return (
    <div className="gracias-page">
      {/* Success Hero */}
      <section className="section section--dark">
        <div className="container" style={{textAlign: 'center', maxWidth: '760px'}}>
          <div style={{marginBottom: '2rem'}}>
            <IconCheck
              style={{
                width: '80px',
                height: '80px',
                color: 'var(--gold-400)',
              }}
            />
          </div>
          <h1 className="display-h2" style={{color: 'var(--cream-50)', marginBottom: '1rem'}}>
            ¡Tu historia ha llegado!
          </h1>
          <p className="lede" style={{color: 'rgba(247,243,234,0.8)', marginBottom: '1.5rem'}}>
            Gracias por compartir un momento tan importante con nosotros.
            Tu memoria es parte del corazón de MORIAH.
          </p>
        </div>
      </section>

      {/* Discount Code */}
      <section className="section section--cream">
        <div className="container" style={{maxWidth: '600px'}}>
          <div style={{
            backgroundColor: 'rgba(19, 54, 43, 0.15)',
            border: '2px solid var(--primary)',
            borderRadius: '8px',
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            <p style={{
              color: 'var(--text-dark)',
              fontSize: '0.95rem',
              marginBottom: '1rem',
              fontWeight: 500,
            }}>
              Tu código de descuento en la primera compra:
            </p>
            <div style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--cream-50)',
              padding: '1.5rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontFamily: 'monospace',
              fontSize: '2rem',
              letterSpacing: '2px',
              fontWeight: 700,
              userSelect: 'all',
            }}>
              {discountCode}
            </div>
            <p style={{
              color: 'var(--gold-400)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              10% de descuento. Vale para cualquier café o suscripción.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--cream-100)',
            borderLeft: '4px solid var(--gold-400)',
            padding: '1.5rem',
            borderRadius: '4px',
            marginBottom: '2rem',
          }}>
            <p style={{
              color: 'var(--text-dark)',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              margin: 0,
            }}>
              <strong>Próximo paso:</strong> Usa este código en la página de checkout.
              O si prefieres, únete al Club de la Memoria para recibir sorpresas cada mes
              y 15% de descuento en cada entrega.
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Now */}
      <section className="section section--pine">
        <div className="container" style={{maxWidth: '600px'}}>
          <h2 className="display-h2" style={{color: 'var(--cream-50)', marginBottom: '2rem', textAlign: 'center'}}>
            Lo que sigue
          </h2>
          <div style={{
            display: 'grid',
            gap: '2rem',
            color: 'var(--cream-50)',
          }}>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{
                flex: '0 0 40px',
                height: '40px',
                backgroundColor: 'var(--gold-400)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}>
                1
              </div>
              <div>
                <p style={{fontWeight: 600, marginBottom: '0.25rem'}}>Tu email está guardado</p>
                <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                  Recibirás un email de bienvenida al Club de la Memoria con más historias
                  de la comunidad.
                </p>
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{
                flex: '0 0 40px',
                height: '40px',
                backgroundColor: 'var(--gold-400)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}>
                2
              </div>
              <div>
                <p style={{fontWeight: 600, marginBottom: '0.25rem'}}>Tu historia es revisada</p>
                <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                  Nuestro equipo leerá tu memoria. Las más hermosas serán compartidas
                  (con tu permiso) en nuestras redes y futuros materiales.
                </p>
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{
                flex: '0 0 40px',
                height: '40px',
                backgroundColor: 'var(--gold-400)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}>
                3
              </div>
              <div>
                <p style={{fontWeight: 600, marginBottom: '0.25rem'}}>Vuelve a visitar</p>
                <p style={{fontSize: '0.9rem', opacity: 0.8}}>
                  Cada mes, nuevas historias de la comunidad aparecen en nuestro Banco de Recuerdos.
                  Eres parte de algo vivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section section--cream">
        <div className="container" style={{textAlign: 'center', maxWidth: '640px'}}>
          <h2 className="display-h2" style={{marginBottom: '1.5rem'}}>
            ¿Listo para probar tu café?
          </h2>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '2rem',
          }}>
            <Link
              to="/collections/cafes"
              className="btn btn--lg"
            >
              Ver nuestros cafés
              <IconArrowRight className="btn-icon" />
            </Link>
            <Link
              to="/quiz"
              className="btn btn--outline-gold btn--lg"
            >
              Hacer el test
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="section section--dark">
        <div className="container" style={{textAlign: 'center', maxWidth: '600px', color: 'rgba(247,243,234,0.7)'}}>
          <p style={{fontSize: '0.9rem', lineHeight: '1.6', margin: 0}}>
            <strong>Nota importante:</strong> Si tienes dudas sobre tu historia o cambios de opinión,
            responde a cualquier email de MORIAH o envíanos un mensaje por WhatsApp.
            Siempre respetamos tu privacidad.
          </p>
        </div>
      </section>
    </div>
  );
}

/** @typedef {import('react-router').Route} Route */
