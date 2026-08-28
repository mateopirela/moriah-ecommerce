import {useFetcher} from 'react-router';

/** Acciones aceptadas por la ruta /cart. */
export const CART_ACTIONS = {
  ADD: 'add',
  UPDATE: 'update',
  REMOVE: 'remove',
  CLEAR: 'clear',
  DISCOUNT: 'discount',
};

/**
 * Formulario que envía una mutación del carrito a /cart sin recargar la página.
 * `children` puede ser una función que recibe el fetcher (estado de envío).
 * @param {{
 *   action: string,
 *   inputs?: Record<string, string|number|null|undefined>,
 *   fetcherKey?: string,
 *   className?: string,
 *   children: React.ReactNode | ((fetcher: import('react-router').FetcherWithComponents<any>) => React.ReactNode),
 * }} props
 */
export function CartForm({action, inputs = {}, fetcherKey, className, children}) {
  const fetcher = useFetcher({key: fetcherKey});
  return (
    <fetcher.Form method="post" action="/cart" className={className}>
      <input type="hidden" name="cartAction" value={action} />
      {Object.entries(inputs).map(([name, value]) =>
        value == null ? null : (
          <input key={name} type="hidden" name={name} value={String(value)} />
        ),
      )}
      {typeof children === 'function' ? children(fetcher) : children}
    </fetcher.Form>
  );
}
