import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import path from 'path';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    target: 'esnext',
    modulePreload: true,
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: ['buffer', 'borc', '@dfinity/candid'],
    },
  },
  optimizeDeps: {
    include: ['@dfinity/candid', '@dfinity/principal', 'buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
    fs: {
      allow: ['..', '../../node_modules']
    },
    middlewares: [
      (req, res, next) => {
        if (req.url.endsWith('.js') || req.url.endsWith('.mjs') || req.url.endsWith('.cjs')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
        next();
      }
    ]
  },
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@dfinity/candid': fileURLToPath(new URL('./node_modules/@dfinity/candid/lib/esm/index.js', import.meta.url)),
    'declarations': fileURLToPath(new URL('../declarations', import.meta.url)),
    'buffer': 'buffer',  // Changed to use the package name
    'borc': fileURLToPath(new URL('./node_modules/borc/dist/borc.esm.js', import.meta.url))
  }
},
define: {
  global: 'globalThis',
  'process.env': {}
}
});
