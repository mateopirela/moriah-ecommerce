import {DEPARTAMENTOS} from '~/data/colombia';

/**
 * Campos de contacto y dirección (checkout y suscripción).
 * @param {{errors?: Record<string,string>, values?: Record<string,string>, notesLabel?: string}} props
 */
export function ShippingFields({errors = {}, values = {}, notesLabel = 'Notas para tu pedido (opcional)'}) {
  const field = (name, label, props = {}) => (
    <div className={`field${errors[name] ? ' field--error' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}</label>
      <input id={`f-${name}`} name={name} defaultValue={values[name] ?? ''} {...props} />
      {errors[name] && (
        <p className="field__error" role="alert">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <>
      <fieldset className="checkout__group">
        <legend>Datos de contacto</legend>
        {field('name', 'Nombre completo', {autoComplete: 'name', required: true})}
        <div className="field-row">
          {field('email', 'Correo', {type: 'email', autoComplete: 'email', required: true})}
          {field('phone', 'Teléfono / WhatsApp', {type: 'tel', autoComplete: 'tel', required: true})}
        </div>
      </fieldset>

      <fieldset className="checkout__group">
        <legend>Dirección de entrega</legend>
        {field('address', 'Dirección', {autoComplete: 'address-line1', required: true, placeholder: 'Calle 12 # 34-56'})}
        {field('address2', 'Apartamento, torre, conjunto (opcional)', {autoComplete: 'address-line2'})}
        <div className="field-row">
          {field('city', 'Ciudad', {autoComplete: 'address-level2', required: true})}
          <div className={`field${errors.region ? ' field--error' : ''}`}>
            <label htmlFor="f-region">Departamento</label>
            <select id="f-region" name="region" defaultValue={values.region ?? ''} required>
              <option value="" disabled>
                Selecciona…
              </option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="field__error" role="alert">
                {errors.region}
              </p>
            )}
          </div>
        </div>
        <div className={`field${errors.notes ? ' field--error' : ''}`}>
          <label htmlFor="f-notes">{notesLabel}</label>
          <textarea
            id="f-notes"
            name="notes"
            rows={2}
            maxLength={500}
            defaultValue={values.notes ?? ''}
            placeholder="¿Es un regalo? Escribe la nota y la incluimos en una postal."
          />
          {errors.notes && (
            <p className="field__error" role="alert">
              {errors.notes}
            </p>
          )}
        </div>
      </fieldset>
    </>
  );
}
