import {data, useLoaderData} from 'react-router';
import {z} from 'zod';
import {StoryPage} from '~/components/StoryPage';
import {BrewGuidePage} from '~/components/BrewGuidePage';
import {ContactPage} from '~/components/ContactPage';
import {getKlaviyo} from '~/lib/klaviyo.server';

const PAGES = {
  'nuestra-historia': {
    title: 'Nuestra Historia · MORIAH Café',
    description:
      'Conoce por qué nos llamamos MORIAH: el monte de la provisión. Un grupo de amigos, fincas aliadas en Colombia y un propósito en cada taza.',
  },
  'prepara-tu-cafe': {
    title: 'Prepara tu café · MORIAH Café',
    description:
      'Guías paso a paso para Aeropress, Chemex, filtrado manual y prensa francesa. El café MORIAH en tu método favorito.',
  },
  contacto: {
    title: 'Contacto · MORIAH Café',
    description: 'Escríbenos y nos contactaremos contigo.',
  },
};

/** @type {import('react-router').MetaFunction} */
export const meta = ({data: routeData}) => [
  {title: routeData?.page?.title ?? 'MORIAH Café'},
  ...(routeData?.page?.description
    ? [{name: 'description', content: routeData.page.description}]
    : []),
];

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({params}) {
  const page = PAGES[params.handle];
  if (!page) throw new Response('Not Found', {status: 404});
  return {page: {...page, handle: params.handle}};
}

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre.'),
  email: z.string().trim().toLowerCase().email('Escribe un correo válido.'),
  phone: z.string().trim().max(40).optional().default(''),
  message: z
    .string()
    .trim()
    .min(10, 'Cuéntanos un poco más (mínimo 10 caracteres).')
    .max(5000, 'El mensaje es demasiado largo.'),
  consent: z.literal('on', {
    errorMap: () => ({message: 'Necesitamos tu autorización para responderte.'}),
  }),
});

/**
 * Formulario de contacto. Antes el componente publicaba a `/contact` (endpoint
 * de Shopify que ya no existe) y mostraba "Muchas gracias" incluso al fallar:
 * los mensajes se perdían. Ahora se valida en el servidor y se registra en
 * Klaviyo; si Klaviyo no está configurado el mensaje queda en los logs del
 * servidor y la persona recibe una confirmación honesta.
 * @param {import('react-router').ActionFunctionArgs} args
 */
export async function action({request, params}) {
  if (params.handle !== 'contacto') {
    throw new Response('Not Found', {status: 404});
  }

  const formData = await request.formData();
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errors = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0]]),
    );
    return data(
      {errors, values: Object.fromEntries(formData)},
      {status: 422},
    );
  }

  const {name, email, phone, message} = parsed.data;
  const klaviyo = getKlaviyo();

  try {
    await klaviyo.upsertProfile({
      email,
      firstName: name,
      properties: {source: 'contacto', phone},
    });
    const tracked = await klaviyo.trackEvent({
      metric: {name: 'Contact Form Submitted'},
      profile: {email},
      properties: {name, phone, message, source: '/pages/contacto'},
    });
    if (!tracked?.success) {
      console.warn('[contacto] mensaje sin registrar en Klaviyo', {
        email,
        name,
        phone,
        message,
      });
    }
  } catch (error) {
    console.error('[contacto] error registrando el mensaje', error, {
      email,
      name,
      phone,
      message,
    });
    return data(
      {
        errors: {
          general:
            'No pudimos enviar tu mensaje. Escríbenos a hola@cafemoriah.com y te respondemos.',
        },
        values: Object.fromEntries(formData),
      },
      {status: 500},
    );
  }

  return data({ok: true});
}

export default function Page() {
  const {page} = useLoaderData();
  if (page.handle === 'nuestra-historia') return <StoryPage />;
  if (page.handle === 'prepara-tu-cafe') return <BrewGuidePage />;
  return <ContactPage />;
}
