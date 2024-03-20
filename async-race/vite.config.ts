import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/salt-upon-wounds-JSFE2023Q4/async-race/',
  appType: 'mpa',
  plugins: [tsconfigPaths()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
