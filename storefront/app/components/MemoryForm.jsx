import {useActionData} from 'react-router';
import {IconArrowRight} from '~/components/Icons';

/**
 * MemoryForm — Capture user's coffee memory story.
 * Headless form component; works with server action for progressive enhancement.
 * Collects: nombre, email, ciudad, historia (textarea), consent checkbox.
 */
export function MemoryForm() {
  const actionData = useActionData();
  const hasErrors = actionData?.errors;
  const isSuccess = actionData?.success;

  return (
    <form method="POST" className="memory-form">
      <fieldset disabled={isSuccess}>
        {hasErrors && (
          <div className="form-errors" role="alert" aria-live="polite">
            <p style={{color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem'}}>
              Por favor, revisa los errores abajo:
            </p>
            <ul style={{color: 'var(--primary)', paddingLeft: '1.5rem'}}>
              {hasErrors.nombre && <li>{hasErrors.nombre}</li>}
              {hasErrors.email && <li>{hasErrors.email}</li>}
              {hasErrors.ciudad && <li>{hasErrors.ciudad}</li>}
              {hasErrors.historia && <li>{hasErrors.historia}</li>}
              {hasErrors.consent && <li>{hasErrors.consent}</li>}
              {hasErrors.general && <li>{hasErrors.general}</li>}
            </ul>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="nombre" className="form-label">
            Tu nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            placeholder="¿Cómo te llamas?"
            defaultValue={actionData?.values?.nombre || ''}
            aria-invalid={hasErrors?.nombre ? 'true' : 'false'}
            aria-describedby={hasErrors?.nombre ? 'error-nombre' : undefined}
          />
          {hasErrors?.nombre && (
            <span id="error-nombre" className="form-error">
              {hasErrors.nombre}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Tu correo
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="tu@email.com"
            defaultValue={actionData?.values?.email || ''}
            aria-invalid={hasErrors?.email ? 'true' : 'false'}
            aria-describedby={hasErrors?.email ? 'error-email' : undefined}
          />
          {hasErrors?.email && (
            <span id="error-email" className="form-error">
              {hasErrors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ciudad" className="form-label">
            Tu ciudad
          </label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            placeholder="Bogotá, Medellín, Cali..."
            defaultValue={actionData?.values?.ciudad || ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="historia" className="form-label">
            ¿A qué te recuerda a ti el olor a café? <span style={{color: 'var(--primary)'}}>*</span>
          </label>
          <textarea
            id="historia"
            name="historia"
            required
            placeholder="Cuéntanos tu memoria... (300–500 palabras)"
            rows={6}
            defaultValue={actionData?.values?.historia || ''}
            aria-invalid={hasErrors?.historia ? 'true' : 'false'}
            aria-describedby={hasErrors?.historia ? 'error-historia' : undefined}
          />
          <span className="form-hint" style={{display: 'block', marginTop: '0.5rem', color: 'var(--gold-300)', fontSize: '0.9rem'}}>
            Mínimo 50 caracteres.
          </span>
          {hasErrors?.historia && (
            <span id="error-historia" className="form-error">
              {hasErrors.historia}
            </span>
          )}
        </div>

        <div className="form-group" style={{display: 'flex', gap: '0.5rem', alignItems: 'flex-start'}}>
          <input
            type="checkbox"
            id="consent"
            name="consent"
            required
            defaultChecked={actionData?.values?.consent === 'on'}
            aria-invalid={hasErrors?.consent ? 'true' : 'false'}
            aria-describedby={hasErrors?.consent ? 'error-consent' : undefined}
            style={{
              marginTop: '0.25rem',
              cursor: 'pointer',
            }}
          />
          <label htmlFor="consent" style={{cursor: 'pointer', fontSize: '0.9rem', color: 'rgba(247,243,234,0.8)'}}>
            Consiento que MORIAH comparta mi historia (o una versión editada) en redes, email y futuros materiales de marca. <span style={{color: 'var(--primary)'}}>*</span>
          </label>
          {hasErrors?.consent && (
            <span id="error-consent" className="form-error" style={{display: 'block', marginTop: '0.5rem'}}>
              {hasErrors.consent}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn--lg btn--memory"
          disabled={isSuccess}
        >
          Compartir mi historia
          <IconArrowRight className="btn-icon" />
        </button>
      </fieldset>

      {isSuccess && (
        <div className="form-success-message" role="alert">
          <p className="form-success-title">
            ¡Gracias por tu historia! 🙏
          </p>
          <p className="form-success-text">
            La guardaremos con cuidado. Será parte del Banco de Recuerdos de MORIAH.
          </p>
        </div>
      )}
    </form>
  );
}

/**
 * CSS for form elements (add to app/styles/components.css)
 */
const FORM_STYLES = `
.memory-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--cream-50);
  font-size: 0.95rem;
}

.form-hint {
  color: var(--gold-300);
  font-size: 0.85rem;
}

.form-error {
  color: #e74c3c;
  font-size: 0.85rem;
  display: block;
  margin-top: 0.25rem;
}

.form-errors {
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

fieldset:disabled {
  opacity: 0.6;
  pointer-events: none;
}
`;

export const FORM_STYLES_CONTENT = FORM_STYLES;
