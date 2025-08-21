import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

export default defineConfig({
plugins: [
  react(),
  svgr(),
  checker({
    typescript: true,
    eslint: {
      lintCommand:
        'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
    },
  }),
],
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src/'),
  },
},
});
