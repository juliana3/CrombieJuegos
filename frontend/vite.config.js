// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // ⬇️ CLAVE PARA PRODUCCIÓN (Nginx) ⬇️
  // Asegura que las rutas de assets (imágenes, CSS, JS) se generen como rutas absolutas (/assets/...)
  // para que Nginx, que sirve la carpeta 'dist' desde la raíz del sitio, las encuentre correctamente.
  base: '/', 
  
  server: {
    // Configuración para el desarrollo local (Docker Compose o local)
    host: '0.0.0.0', 
    port: 5173, 
    watch: {
      usePolling: true // Necesario para detectar cambios de archivos en contenedores WSL/Docker
    },
    
    // Proxy para redirigir llamadas a la API
    // En desarrollo con Docker Compose, 'backend' se resuelve a la IP del contenedor de backend.
    proxy: {
      '/api': {
        target: 'http://backend:3000', 
        changeOrigin: true, 
      },
    },
  },
})