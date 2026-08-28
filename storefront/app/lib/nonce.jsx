import {createContext, useContext} from 'react';

const NonceContext = createContext(undefined);

/** Provee el nonce de la CSP a los componentes que inyectan <script>. */
export function NonceProvider({value, children}) {
  return <NonceContext.Provider value={value}>{children}</NonceContext.Provider>;
}

export function useNonce() {
  return useContext(NonceContext);
}
