import {HydratedRouter} from 'react-router/dom';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {NonceProvider} from '~/lib/nonce';

startTransition(() => {
  // Reuse the nonce the server rendered so injected scripts keep passing the CSP.
  const existingNonce = document.querySelector('script[nonce]')?.nonce;

  hydrateRoot(
    document,
    <StrictMode>
      <NonceProvider value={existingNonce}>
        <HydratedRouter />
      </NonceProvider>
    </StrictMode>,
  );
});
