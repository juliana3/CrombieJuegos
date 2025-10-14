FROM node:20-alpine

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar TODO el código
COPY . .

# Usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Darle permisos a la carpeta data
RUN chown -R nodejs:nodejs /app/data

USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]