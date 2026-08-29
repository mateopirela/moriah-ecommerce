import {createContext, useCallback, useContext, useEffect, useId, useRef, useState} from 'react';

/**
 * Panel lateral (carrito, búsqueda, menú) con overlay.
 *
 * Antes los tres paneles vivían siempre en el DOM como `role="dialog"`
 * `aria-modal` (ocultos solo con `visibility`), no recibían foco al abrirse,
 * no bloqueaban el scroll de la página ni el contenido de detrás, y el botón
 * de cierre decía "Close" en un sitio en español. Ahora solo se monta el panel
 * activo, el foco entra y vuelve a su origen, y el fondo queda inerte.
 *
 * @param {{
 *   children?: React.ReactNode;
 *   type: AsideType;
 *   heading: React.ReactNode;
 * }}
 */
export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Escape cierra; Tab queda atrapado dentro del panel.
  useEffect(() => {
    if (!expanded) return undefined;
    const abort = new AbortController();

    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          close();
          return;
        }
        if (event.key !== 'Tab' || !panelRef.current) return;
        const focusables = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      },
      {signal: abort.signal},
    );

    return () => abort.abort();
  }, [close, expanded]);

  // Bloquea el scroll del documento mientras el panel está abierto.
  useEffect(() => {
    if (!expanded) return undefined;
    const {overflow} = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [expanded]);

  // El foco entra al panel (botón de cerrar) al abrir.
  useEffect(() => {
    if (expanded) closeRef.current?.focus();
  }, [expanded]);

  return (
    <div
      className={`overlay ${expanded ? 'expanded' : ''}`}
      // `inert` mantiene el panel fuera del orden de tabulación y del árbol
      // de accesibilidad mientras está cerrado, sin desmontarlo (la animación
      // de salida necesita que siga en el DOM).
      inert={expanded ? undefined : ''}
      aria-hidden={expanded ? undefined : 'true'}
    >
      <button className="close-outside" onClick={close} aria-label="Cerrar" tabIndex={-1} />
      <aside role="dialog" aria-modal="true" aria-labelledby={id} ref={panelRef}>
        <header>
          <h2 id={id}>{heading}</h2>
          <button className="close" onClick={close} aria-label="Cerrar" ref={closeRef}>
            <span aria-hidden="true">&times;</span>
          </button>
        </header>
        <div className="aside__body">{children}</div>
      </aside>
    </div>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');
  const lastTrigger = useRef(null);

  const open = useCallback((next) => {
    lastTrigger.current = document.activeElement;
    setType(next);
  }, []);

  // Al cerrar, el foco vuelve al control que abrió el panel.
  const close = useCallback(() => {
    setType('closed');
    const trigger = lastTrigger.current;
    if (trigger && typeof trigger.focus === 'function') {
      requestAnimationFrame(() => trigger.focus());
    }
  }, []);

  return (
    <AsideContext.Provider value={{type, open, close}}>{children}</AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */
