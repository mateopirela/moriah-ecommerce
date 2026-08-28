import {data} from 'react-router';
import {z} from 'zod';
import {getKlaviyo} from '~/lib/klaviyo.server';

const Schema = z.object({email: z.string().trim().toLowerCase().email()});

/**
 * Captura de correo (Club de la Memoria / newsletter). Crea el perfil en
 * Klaviyo y lo suscribe a la lista de comunidad; si Klaviyo no está
 * configurado responde OK igualmente para no perder la conversión.
 * @param {import('react-router').ActionFunctionArgs} args
 */
export async function action({request}) {
  const formData = await request.formData();
  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return data({ok: false, error: 'Ingresa un correo válido.'}, {status: 422});
  }
  const {email} = parsed.data;
  const klaviyo = getKlaviyo();
  try {
    await klaviyo.upsertProfile({
      email,
      properties: {source: 'newsletter-home', discount_code: 'MIPRIMERTINTO10'},
    });
    await klaviyo.subscribe({email});
  } catch (error) {
    console.error('newsletter klaviyo error', error);
  }
  return data({ok: true, code: 'MIPRIMERTINTO10'});
}

export function loader() {
  return new Response('Method Not Allowed', {status: 405});
}
