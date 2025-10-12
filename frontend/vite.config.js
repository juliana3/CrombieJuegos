// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', 
    port: 5173,      
    watch: {
      usePolling: true // ← AGREGAR: Detecta cambios en archivos dentro de Docker
    },
    proxy: {
      // Redirige cualquier petición que empiece con /api al backend
      '/api': {
        target: 'http://backend:3000', // ← CAMBIAR: Usa el nombre del servicio de Docker
        changeOrigin: true, // Necesario para evitar errores de CORS
      },
    },
  },
})