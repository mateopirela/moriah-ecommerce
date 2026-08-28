import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
import {reactRouter} from '@react-router/dev/vite';

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      // Explicit `~` → app alias. tsconfigPaths fails to resolve when the
      // project lives in a path containing spaces (e.g. "Moriah E-commerce").
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  build: {
    // Allow a strict Content-Security-Policy without inlining assets as base64.
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'node',
    include: ['app/**/*.test.js', 'tests/**/*.test.js'],
  },
});
