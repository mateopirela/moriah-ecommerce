import {useEffect} from 'react';

/**
 * Tras un envío fallido, lleva el foco al primer campo con error.
 * Antes de esto el servidor devolvía el formulario con el campo en rojo pero
 * el foco se quedaba en <body>: en móvil había que buscar el error a mano.
 * @param {Record<string, string>|undefined} errors
 */
export function useFocusFirstError(errors) {
  const errorKey = errors ? Object.keys(errors).join(',') : '';
  useEffect(() => {
    if (!errorKey) return;
    const target =
      document.querySelector(
        '.field--error input, .field--error select, .field--error textarea',
      ) ??
      document.querySelector('[aria-invalid="true"]') ??
      document.querySelector('[role="alert"]');
    if (!target) return;
    if (typeof target.focus === 'function') {
      target.focus({preventScroll: true});
    }
    target.scrollIntoView({block: 'center', behavior: 'smooth'});
  }, [errorKey]);
}
