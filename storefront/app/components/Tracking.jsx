import {useEffect} from 'react';
import {useAnalytics} from '@shopify/hydrogen';

/**
 * Injects GA4 + Meta Pixel base snippets. Dormant unless the matching
 * env IDs are provided (PUBLIC_GA4_ID / PUBLIC_META_PIXEL_ID).
 * Rendered with the request nonce so it satisfies the CSP.
 * @param {{gaId?: string|null, metaPixelId?: string|null, nonce?: string}}
 */
export function Tracking({gaId, metaPixelId, nonce}) {
  if (!gaId && !metaPixelId) return null;

  return (
    <>
      {gaId && (
        <>
          <script
            async
            nonce={nonce}
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`,
            }}
          />
        </>
      )}
      {metaPixelId && (
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');`,
          }}
        />
      )}
    </>
  );
}

/**
 * Bridges Hydrogen's analytics funnel events to GA4 + Meta Pixel.
 * Mount inside <Analytics.Provider>. No-ops when no pixels are loaded.
 */
export function CustomAnalytics() {
  const {subscribe, register} = useAnalytics();

  useEffect(() => {
    const {ready} = register('moriah-custom-analytics');

    const gtag = (...args) => {
      if (typeof window !== 'undefined' && window.gtag) window.gtag(...args);
    };
    const fbq = (...args) => {
      if (typeof window !== 'undefined' && window.fbq) window.fbq(...args);
    };

    const money = (p) => ({
      value: Number(p?.price ?? p?.totalAmount?.amount ?? 0),
      currency: p?.currencyCode ?? 'COP',
    });

    subscribe('page_viewed', () => {
      gtag('event', 'page_view');
      fbq('track', 'PageView');
    });

    subscribe('product_viewed', ({products}) => {
      const p = products?.[0];
      if (!p) return;
      gtag('event', 'view_item', {
        currency: 'COP',
        value: Number(p.price ?? 0),
        items: [{item_id: p.id, item_name: p.title, price: Number(p.price ?? 0)}],
      });
      fbq('track', 'ViewContent', {
        content_name: p.title,
        content_ids: [p.id],
        content_type: 'product',
        value: Number(p.price ?? 0),
        currency: 'COP',
      });
    });

    subscribe('collection_viewed', ({collection}) => {
      gtag('event', 'view_item_list', {item_list_id: collection?.handle});
    });

    subscribe('product_added_to_cart', ({currentLine}) => {
      if (!currentLine) return;
      const m = money(currentLine.cost?.totalAmount);
      gtag('event', 'add_to_cart', {
        currency: m.currency,
        value: m.value,
        items: [{item_id: currentLine.merchandise?.product?.id, quantity: currentLine.quantity}],
      });
      fbq('track', 'AddToCart', {
        content_ids: [currentLine.merchandise?.product?.id],
        content_type: 'product',
        value: m.value,
        currency: m.currency,
      });
    });

    subscribe('search_viewed', ({searchTerm}) => {
      gtag('event', 'search', {search_term: searchTerm});
      fbq('track', 'Search', {search_string: searchTerm});
    });

    ready();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
