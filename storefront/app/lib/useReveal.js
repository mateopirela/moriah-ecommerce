import {useEffect} from 'react';

/**
 * Scroll-reveal: observa todos los elementos [data-reveal] de la página y
 * les agrega .is-revealed al entrar al viewport (una sola vez).
 * Los hijos con [data-reveal-child] entran en cascada (stagger) vía CSS.
 *
 * Usa un MutationObserver además del IntersectionObserver porque React
 * puede reemplazar nodos después de la hidratación (Suspense) y los nodos
 * nuevos deben registrarse también. Respeta prefers-reduced-motion (CSS).
 */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        }
      },
      {rootMargin: '0px 0px -8% 0px', threshold: 0.05},
    );

    const observed = new WeakSet();
    const observeAll = () => {
      document
        .querySelectorAll('[data-reveal]:not(.is-revealed)')
        .forEach((el) => {
          if (!observed.has(el)) {
            observed.add(el);
            io.observe(el);
          }
        });
    };

    observeAll();

    // Reintenta cuando cambia el DOM (hidratación, Suspense, paginación)
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, {childList: true, subtree: true});

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
