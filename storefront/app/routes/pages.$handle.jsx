import {useLoaderData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {StoryPage} from '~/components/StoryPage';

// Pages rendered locally until they exist in Shopify (seed→Shopify pattern).
const SEED_PAGES = {
  'nuestra-historia': {
    title: 'Nuestra Historia · Moriah, el monte de la provisión',
    description:
      'Conoce por qué nos llamamos MORIAH: el monte de la provisión. Un grupo de amigos, fincas aliadas en Colombia y un propósito en cada taza.',
  },
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: data?.page?.title ? `${data.page.title} · MORIAH Café` : 'MORIAH Café'},
    ...(data?.page?.seo?.description || data?.page?.description
      ? [
          {
            name: 'description',
            content: data.page.seo?.description ?? data.page.description,
          },
        ]
      : []),
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

  if (isSeed && page.handle === 'nuestra-historia') {
    return <StoryPage />;
  }

  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
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
