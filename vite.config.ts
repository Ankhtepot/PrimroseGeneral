import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/PrimroseGeneral/',
  plugins: [react()],
  resolve: {
    alias: {
      '@public': path.resolve(__dirname, './public'),
      '@images': path.resolve(__dirname, './public/images'),
      '@src': path.resolve(__dirname, './src'),
    },
  },
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
