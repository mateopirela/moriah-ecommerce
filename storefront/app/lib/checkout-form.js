import {z} from 'zod';
import {DEPARTAMENTOS} from '~/data/colombia';

const phone = z
  .string()
  .trim()
  .min(7, 'Ingresa un teléfono válido')
  .max(20, 'Ingresa un teléfono válido')
  .regex(/^[+\d\s()-]+$/, 'Ingresa un teléfono válido');

/** Datos de contacto + envío compartidos por checkout y suscripción. */
export const ShippingSchema = z.object({
  name: z.string().trim().min(2, 'Ingresa tu nombre completo').max(120),
  email: z.string().trim().toLowerCase().email('Ingresa un correo válido'),
  phone,
  address: z.string().trim().min(5, 'Ingresa la dirección de entrega').max(200),
  address2: z.string().trim().max(120).optional().default(''),
  city: z.string().trim().min(2, 'Ingresa la ciudad').max(80),
  region: z.enum(DEPARTAMENTOS, {errorMap: () => ({message: 'Selecciona el departamento'})}),
  notes: z.string().trim().max(500, 'Máximo 500 caracteres').optional().default(''),
});

/**
 * @param {FormData} formData
 * @returns {{success: true, data: z.infer<typeof ShippingSchema>} | {success: false, errors: Record<string,string>, values: Record<string,string>}}
 */
export function parseShipping(formData) {
  const values = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === 'string'),
  );
  const result = ShippingSchema.safeParse(values);
  if (result.success) return {success: true, data: result.data};
  const errors = {};
  for (const [key, messages] of Object.entries(result.error.flatten().fieldErrors)) {
    errors[key] = messages?.[0] ?? 'Revisa este campo';
  }
  return {success: false, errors, values};
}

/** Objeto de envío que se guarda en el pedido / la suscripción. */
export function toShippingRecord(data) {
  return {
    name: data.name,
    phone: data.phone,
    address: data.address,
    address2: data.address2 || null,
    city: data.city,
    region: data.region,
    country: 'CO',
  };
}
