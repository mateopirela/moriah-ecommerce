import {useEffect, useRef} from 'react';
import {useLocation} from 'react-router';
import {analytics} from '~/lib/analytics';

/**
 * Inyecta GA4 + Meta Pixel. Inactivo mientras no existan los IDs en el entorno
 * (PUBLIC_GA4_ID / PUBLIC_META_PIXEL_ID). Usa el nonce de la CSP.
 * @param {{gaId?: string|null, metaPixelId?: string|null, nonce?: string}} props
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
      <PageViewTracker />
    </>
  );
}

/** Emite page_view en cada navegación del cliente. */
function PageViewTracker() {
  const {pathname, search} = useLocation();
  const last = useRef(null);
  useEffect(() => {
    const key = pathname + search;
    if (last.current === key) return;
    last.current = key;
    analytics.pageView();
  }, [pathname, search]);
  return null;
}
