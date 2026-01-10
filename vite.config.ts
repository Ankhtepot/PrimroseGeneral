import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/PrimroseGeneral/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'https://77.42.74.201:8080', // HTTP
        target: 'https://77.42.74.201:443',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        // target: 'https://77.42.74.201:8080', //HTTP
        target: 'https://77.42.74.201:443',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
