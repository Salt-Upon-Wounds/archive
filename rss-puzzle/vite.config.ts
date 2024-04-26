import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/salt-upon-wounds-JSFE2023Q4/rss-puzzle/',
  plugins: [tsconfigPaths()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
