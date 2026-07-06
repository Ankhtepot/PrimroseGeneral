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
        target: 'https://api.primrose.work',
        changeOrigin: true,
        secure: true,
      },
      '/health': {
        target: 'https://api.primrose.work',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
