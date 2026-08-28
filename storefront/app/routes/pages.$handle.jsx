import {useLoaderData} from 'react-router';
import {StoryPage} from '~/components/StoryPage';
import {BrewGuidePage} from '~/components/BrewGuidePage';
import {ContactPage} from '~/components/ContactPage';

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
export const meta = ({data}) => [
  {title: data?.page?.title ?? 'MORIAH Café'},
  ...(data?.page?.description ? [{name: 'description', content: data.page.description}] : []),
];

/** @param {import('react-router').LoaderFunctionArgs} args */
export function loader({params}) {
  const page = PAGES[params.handle];
  if (!page) throw new Response('Not Found', {status: 404});
  return {page: {...page, handle: params.handle}};
}

export default function Page() {
  const {page} = useLoaderData();
  if (page.handle === 'nuestra-historia') return <StoryPage />;
  if (page.handle === 'prepara-tu-cafe') return <BrewGuidePage />;
  return <ContactPage />;
}
