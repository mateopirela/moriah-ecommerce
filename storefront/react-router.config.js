import {vercelPreset} from '@vercel/react-router/vite';

/**
 * React Router 7 (framework mode) configuration.
 * The Vercel preset emits the Build Output API directory for the existing
 * Vercel project; locally `react-router dev` / `react-router-serve` work as usual.
 * @type {import('@react-router/dev/config').Config}
 */
export default {
  ssr: true,
  presets: [vercelPreset()],
};
