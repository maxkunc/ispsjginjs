import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
