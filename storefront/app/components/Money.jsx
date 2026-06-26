import {formatCop} from '~/data/cafes';

/**
 * Drop-in replacement del <Money> de Hydrogen con formato colombiano
 * ($ 45.000, sin decimales). Evita el mismatch de hidratación del Money
 * original: el ICU del servidor (workerd) formatea COP con 2 decimales y el
 * del navegador con 0, lo que rompe la hidratación. Aquí ambos lados usan el
 * mismo formateador explícito (es-CO, 0 decimales).
 * @param {{data?: {amount?: string, currencyCode?: string}, as?: any}} props
 */
export function Money({data, as: Component = 'span', ...props}) {
  if (data?.amount == null) return null;
  return (
    <Component {...props}>
      {formatCop(Number(data.amount), data.currencyCode || 'COP')}
    </Component>
  );
}
