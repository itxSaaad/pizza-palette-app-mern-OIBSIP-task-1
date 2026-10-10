import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const clientRoot = fileURLToPath(new URL('.', import.meta.url));

const normalizeApiBase = (value) => {
  const configured = value?.trim();
  const valid = configured && configured !== 'undefined' && configured !== 'null';
  const base = valid ? configured.replace(/\/+$/, '') : '/api';
  return base === '/api' || base.endsWith('/api') ? base : `${base}/api`;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, clientRoot, 'VITE_');
  const apiBase = normalizeApiBase(env.VITE_SERVER_URL);

  return {
    define: {
      'import.meta.env.VITE_SERVER_URL': JSON.stringify(apiBase),
    },
    plugins: [
      react(),
      VitePWA({
        // Do not leave installed/mobile clients on a cached bundle indefinitely.
        // Prompt mode needs app UI to call updateSW(); this app has no such UI.
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'Pizza Palette | MERN',
          short_name: 'Pizza Palette',
          description: 'Order your favorite pizza Now! We deliver the best pizza in town.',
          icons: [
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/favicon-32x32.png',
              sizes: '32x32',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/favicon-16x16.png',
              sizes: '16x16',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/favicon.ico',
              sizes: '32x32 16x16',
              type: 'image/x-icon',
              purpose: 'any',
            },
          ],
          screenshots: [
            {
              src: '/images/screen1.png',
              sizes: '2880x1800',
              type: 'image/png',
            },
          ],
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          orientation: 'portrait',
        },
      }),
    ],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
    },
  };
});
