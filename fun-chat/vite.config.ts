import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: process.env.VITE_urlprefix,
    plugins: [tsconfigPaths()],
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
  });
};
