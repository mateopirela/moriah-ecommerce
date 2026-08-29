import {vercelPreset} from '@vercel/react-router/vite';

/**
 * React Router 7 (framework mode) configuration.
 * The Vercel preset emits the Build Output API directory for the existing
 * Vercel project; locally `react-router dev` / `react-router-serve` work as usual.
 *
 * `routeDiscovery: initial` envía el manifiesto completo en la carga inicial en
 * lugar de descubrir rutas bajo demanda. Con ~25 rutas el manifiesto es pequeño
 * y desaparece la carrera entre el descubrimiento de una ruta y la primera
 * petición que la usa (ver components/CartUpsell.jsx).
 * @type {import('@react-router/dev/config').Config}
 */
export default {
  ssr: true,
  routeDiscovery: {mode: 'initial'},
  presets: [vercelPreset()],
};
