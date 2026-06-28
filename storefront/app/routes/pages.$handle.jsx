import {useLoaderData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {StoryPage} from '~/components/StoryPage';
import {BrewGuidePage} from '~/components/BrewGuidePage';
import {ContactPage} from '~/components/ContactPage';

// Pages rendered locally until they exist in Shopify (seed→Shopify pattern).
const SEED_PAGES = {
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

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const seed = SEED_PAGES[data?.page?.handle];
  const title = seed ? seed.title : (data?.page?.title ? `${data.page.title} · MORIAH Café` : 'MORIAH Café');
  const description = seed?.description || data?.page?.seo?.description || data?.page?.description;
  return [
    {title},
    ...(description ? [{name: 'description', content: description}] : []),
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront
    .query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    })
    .catch(() => ({page: null}));

  if (!page) {
    // Fall back to a locally rendered page until it exists in Shopify.
    const seedPage = SEED_PAGES[params.handle];
    if (seedPage) {
      return {page: {...seedPage, handle: params.handle}, isSeed: true};
    }
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
    isSeed: false,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData() {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page, isSeed} = useLoaderData();

  if (isSeed) {
    if (page.handle === 'nuestra-historia') return <StoryPage />;
    if (page.handle === 'prepara-tu-cafe') return <BrewGuidePage />;
    if (page.handle === 'contacto') return <ContactPage />;
  }

  return (
    <div className="tx-page">
      <section className="tx-page-section">
        <h1 className="tx-display tx-h1" style={{color:'var(--tx-gold)', marginBottom:'2rem'}}>{page.title}</h1>
        <div
          className="tx-lede"
          style={{maxWidth:'70ch', lineHeight:1.8}}
          dangerouslySetInnerHTML={{__html: page.body}}
        />
      </section>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;

/** @typedef {import('./+types/pages.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
