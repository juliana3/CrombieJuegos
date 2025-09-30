// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige cualquier petición que empiece con /api al backend
      '/api': {
        target: 'http://localhost:3000', // Tu servidor backend
        changeOrigin: true, // Necesario para evitar errores de CORS
      },
    },
  },
})