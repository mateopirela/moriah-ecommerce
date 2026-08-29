import {useActionData, useNavigation} from 'react-router';
import {IconArrowRight} from '~/components/Icons';
import {useFocusFirstError} from '~/lib/useFocusFirstError';

/**
 * MemoryForm — captura la historia de café de la persona (#MiPrimerTinto).
 * Mejora progresiva: funciona sin JavaScript y valida en el servidor
 * (ver routes/memoria._index.jsx).
 */
export function MemoryForm() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const sending = navigation.state === 'submitting';
  const errors = actionData?.errors;
  const values = actionData?.values ?? {};
  useFocusFirstError(errors);

  return (
    <form method="POST" className="memory-form">
      <fieldset disabled={sending}>
        {errors && (
          <div className="form-errors" role="alert">
            <p>Revisa estos campos para poder guardar tu historia:</p>
            <ul>
              {errors.nombre && <li>{errors.nombre}</li>}
              {errors.email && <li>{errors.email}</li>}
              {errors.ciudad && <li>{errors.ciudad}</li>}
              {errors.historia && <li>{errors.historia}</li>}
              {errors.consent && <li>{errors.consent}</li>}
              {errors.general && <li>{errors.general}</li>}
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
            autoComplete="name"
            placeholder="¿Cómo te llamas?"
            defaultValue={values.nombre ?? ''}
            aria-invalid={errors?.nombre ? 'true' : undefined}
            aria-describedby={errors?.nombre ? 'error-nombre' : undefined}
          />
          {errors?.nombre && (
            <span id="error-nombre" className="form-error">
              {errors.nombre}
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
            autoComplete="email"
            placeholder="tu@correo.com"
            defaultValue={values.email ?? ''}
            aria-invalid={errors?.email ? 'true' : undefined}
            aria-describedby={errors?.email ? 'error-email' : undefined}
          />
          {errors?.email && (
            <span id="error-email" className="form-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ciudad" className="form-label">
            Tu ciudad <span className="field__optional">(opcional)</span>
          </label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            autoComplete="address-level2"
            placeholder="Bogotá, Medellín, Cali…"
            defaultValue={values.ciudad ?? ''}
          />
        </div>

        <div className="form-group">
          <label htmlFor="historia" className="form-label">
            ¿A qué te recuerda a ti el olor a café?
          </label>
          <textarea
            id="historia"
            name="historia"
            required
            placeholder="Cuéntanos tu memoria: dónde estabas, con quién, a qué olía…"
            rows={6}
            defaultValue={values.historia ?? ''}
            aria-invalid={errors?.historia ? 'true' : undefined}
            aria-describedby={
              errors?.historia ? 'error-historia hint-historia' : 'hint-historia'
            }
          />
          <span className="form-hint" id="hint-historia">
            Mínimo 50 caracteres. Sin límite de cariño.
          </span>
          {errors?.historia && (
            <span id="error-historia" className="form-error">
              {errors.historia}
            </span>
          )}
        </div>

        <div className="form-group form-consent">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            required
            defaultChecked={values.consent === 'on'}
            aria-invalid={errors?.consent ? 'true' : undefined}
            aria-describedby={errors?.consent ? 'error-consent' : undefined}
          />
          <label htmlFor="consent">
            Consiento que MORIAH comparta mi historia (o una versión editada) en redes,
            email y futuros materiales de marca.
            {errors?.consent && (
              <span id="error-consent" className="form-error">
                {errors.consent}
              </span>
            )}
          </label>
        </div>

        <button type="submit" className="btn btn--lg btn--block">
          {sending ? 'Guardando…' : 'Compartir mi historia'}
          {!sending && <IconArrowRight className="btn-icon" />}
        </button>
      </fieldset>
    </form>
  );
}
