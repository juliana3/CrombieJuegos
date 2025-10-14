# Etapa 1: Build
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .
RUN npm run build

# ----------------------------------------------------

# Etapa 2: Production con Nginx
FROM nginx:alpine

# Copiar los archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# ⬇️ 🚨 CORRECCIÓN CLAVE PARA EL 404 DE /assets/fondo.svg 🚨 ⬇️
# Nginx busca la imagen en la carpeta 'assets', pero Vite la dejó en la raíz.
# Forzamos su ubicación correcta:

# 1. Asegura que la carpeta 'assets' exista (solo si no existe ya).
RUN mkdir -p /usr/share/nginx/html/assets/

# 2. Mueve fondo.svg desde la raíz a la carpeta assets/
RUN mv /usr/share/nginx/html/fondo.svg /usr/share/nginx/html/assets/fondo.svg

# ----------------------------------------------------

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]