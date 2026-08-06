import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: {
    host: 'localhost',
    port: 5173,
    open: false,
    fs: {
      allow: ['.']
    }
  }
});
