import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'fonts/*'],
      manifest: {
        name: 'is・psjg',
        short_name: 'is・psjg',
        description: 'is.psjg.cz grades dashboard',
        start_url: '/',
        display: 'standalone',
        background_color: '#e8e6e1',
        theme_color: '#e8e6e1',
        lang: 'en',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Never cache the API - grades/portfolio/exam data must always be
        // fetched live, only the app shell (JS/CSS/fonts) is precached.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      // Lets `npm run dev` talk to a local Flask backend (see openschoolsucks)
      // without needing CORS during development.
      '/api': {
        target: process.env.VITE_DEV_API_PROXY || 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
