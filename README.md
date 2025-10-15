# Crombie Juegos - Sistema de Juego de Trivia Interactivo

Plataforma web de juego de trivia con ruleta interactiva, sistema de premios y gestión de participantes integrado con Google Workspace.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/2Diego2/CrombieJuegos)

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura de Directorios](#estructura-de-directorios)
- [Gestión de Contenido](#gestión-de-contenido)
- [Endpoints de la API](#endpoints-de-la-api)
- [Deploy en Producción](#deploy-en-producción)
- [Solución de Problemas](#solución-de-problemas)
- [Contribuir](#contribuir)

## Descripción

**Crombie Juegos** es una plataforma interactiva de juego de trivia diseñada para activaciones de marca y eventos de marketing. El sistema combina una ruleta virtual con preguntas de trivia, permitiendo a los participantes ganar premios basados en sus conocimientos. Incluye un panel administrativo completo para gestionar preguntas, categorías y premios, con almacenamiento automático de datos de participantes en Google Sheets y hosting de imágenes en Google Drive.

## Características

- **Sistema de Juego Completo:**
  - Ruleta animada con física realista
  - Sistema de preguntas de trivia por categorías y dificultades
  - Gestión dinámica de premios con control de stock
  - Validación de disponibilidad en tiempo real
  - Animaciones y efectos visuales

- **Panel Administrativo:**
  - CRUD completo de preguntas de trivia
  - Gestión de categorías con visibilidad configurable
  - Gestión de premios con carga de imágenes
  - Control de stock y estado de premios
  - Interfaz intuitiva de administración

- **Sistema de Categorías:**
  - Organización de preguntas por categoría temática
  - Tres niveles de dificultad (fácil, medio, difícil)
  - Control de visibilidad por categoría
  - Soporte para múltiples respuestas por pregunta

- **Gestión de Participantes:**
  - Registro de usuarios con validación
  - Almacenamiento automático en Google Sheets
  - Sistema de sorteos independiente
  - Términos y condiciones

- **Integración con Google Cloud:**
  - Google Sheets API para almacenamiento de participantes
  - Google Drive API para hosting de imágenes de premios
  - Autenticación mediante Service Account
  - Operaciones atómicas para prevenir condiciones de carrera

- **Arquitectura Dockerizada:**
  - Configuraciones separadas para desarrollo y producción
  - Optimización con multi-stage builds
  - Servidor Nginx para producción
  - Health checks automáticos

## Instalación

### Requisitos Previos

- Docker y Docker Compose instalados
- Archivo de credenciales de Google Cloud Service Account
- Acceso a una hoja de Google Sheets
- Carpeta de Google Drive para imágenes de premios

### Despliegue con Docker (Recomendado)

#### Modo Desarrollo

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/2Diego2/CrombieJuegos.git
   cd CrombieJuegos
   ```

2. **Configurar variables de entorno:**

   Crear el archivo `backend/.env` con las siguientes variables:

   ```bash
   NODE_ENV=development
   PORT=3000
   
   # Google Sheets
   ID_HOJA_SHEETS_MAILS=tu-id-de-sheets  # CAMBIAR: ID de tu Google Sheet
   
   # Google Drive
   ID_UNIDAD_COMPARTIDA=tu-id-de-unidad-compartida  # CAMBIAR: ID de tu Drive compartido
   ID_CARPETA_FOTOS_PREMIOS=id-carpeta-fotos  # CAMBIAR: ID de carpeta de imágenes
   
   # Credenciales
   SERVICE_ACCOUNT_FILE=jtus-credenciales.json
   ```

3. **Colocar archivo de credenciales de Google:**

   Asegúrate de que el archivo JSON de credenciales de Google Cloud esté en `backend/tus-credenciales.json`

4. **Iniciar los servicios:**

   ```bash
   docker-compose up --build
   ```

   Esto iniciará:
   - Backend Express (puerto 3000)
   - Frontend React + Vite (puerto 5173)

5. **Verificar el despliegue:**

   ```bash
   docker ps
   docker-compose logs -f
   ```

6. **Acceder a la aplicación:**

   ```
   Frontend (Juego): http://localhost:5173
   Backend (API): http://localhost:3000
   Health Check: http://localhost:3000/health
   ```


### Instalación Manual (Desarrollo Local)

#### Backend

1. **Instalar dependencias:**

   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno** según se indica arriba

3. **Ejecutar el servidor:**

   ```bash
   npm start
   ```

#### Frontend

1. **Instalar dependencias:**

   ```bash
   cd frontend
   npm install
   ```

2. **Ejecutar servidor de desarrollo:**

   ```bash
   npm run dev
   ```

## Configuración

### Archivos Requeridos

- `backend/.env` - Variables de entorno
- `backend/tus-credenciales.json` - Credenciales de Google Cloud Service Account
- `backend/data/data.json` - Preguntas de trivia organizadas por categoría
- `backend/data/premios.json` - Configuración de premios disponibles

### Variables de Entorno

Archivo `backend/.env`:

```env
# Entorno
NODE_ENV=production

# Servidor
PORT=3000

# Google Sheets - Participantes
ID_HOJA_SHEETS_MAILS=tu_id_de_google_sheets  # CAMBIAR: Hoja para registro de emails

# Google Drive - Almacenamiento de imágenes
ID_UNIDAD_COMPARTIDA=tu_drive_id  # CAMBIAR: ID del Drive compartido
ID_CARPETA_FOTOS_PREMIOS=tu_folder_id  # CAMBIAR: Carpeta para imágenes de premios

# Credenciales
SERVICE_ACCOUNT_FILE=tus-credenciales.json  # Nombre del archivo de credenciales
```

### Configuración de Google Cloud

1. **Crear Service Account:**
   - Ir a [Google Cloud Console](https://console.cloud.google.com)
   - Crear un proyecto nuevo o seleccionar uno existente
   - Navegar a "IAM y administración" → "Cuentas de servicio"
   - Crear una cuenta de servicio
   - Generar y descargar la clave JSON

2. **Habilitar APIs necesarias:**
   - Google Sheets API
   - Google Drive API

3. **Configurar permisos en Google Sheets:**
   - Abrir la hoja de Google Sheets
   - Compartir con el email de la Service Account (client_email del JSON)
   - Dar permisos de Editor

4. **Estructura de la hoja:**
   
   La hoja debe tener una pestaña llamada **"eventos"** con las siguientes columnas:

   | Fecha | Nombre | Apellido | Email |
   |-------|--------|----------|-------|

5. **Configurar carpeta de Google Drive:**
   - Crear una carpeta en Google Drive para las imágenes de premios
   - Compartir la carpeta con la Service Account
   - Dar permisos de Editor
   - Copiar el ID de la carpeta (de la URL) a `ID_CARPETA_FOTOS_PREMIOS`

### Configuración de Preguntas

El archivo `backend/data/data.json` contiene las preguntas de trivia organizadas por categoría y dificultad:

```json
{
  "categorias": {
    "Categoria1": {
      "visible": true,
      "facil": [
        {
          "pregunta": "¿Cuál es la capital de Francia?",
          "respuestas": [
            { "texto": "París", "correcta": true },
            { "texto": "Londres", "correcta": false },
            { "texto": "Berlín", "correcta": false },
            { "texto": "Madrid", "correcta": false }
          ]
        }
      ],
      "medio": [...],
      "dificil": [...]
    },
    "Categoria2": {...}
  }
}
```

**Estructura:**
- `categorias`: Objeto contenedor de todas las categorías
- `visible`: Booleano que controla si la categoría aparece en el juego
- `facil/medio/dificil`: Arrays de preguntas por nivel de dificultad
- `pregunta`: Texto de la pregunta
- `respuestas`: Array de objetos con texto y flag de correcta

### Configuración de Premios

El archivo `backend/data/premios.json` define los premios disponibles:

```json
{
  "premios": [
    {
      "nombre": "Premio Principal",
      "descripcion": "Descripción del premio",
      "cantidad": 10,
      "imagen": "https://drive.google.com/uc?id=XXXXX",
      "activo": true
    }
  ]
}
```

**Propiedades:**
- `nombre`: Identificador único del premio
- `descripcion`: Descripción detallada
- `cantidad`: Stock disponible
- `imagen`: URL de la imagen en Google Drive
- `activo`: Si el premio está disponible o no

### Configuración de Vite (Frontend)

Archivo `frontend/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: 'http://backend:3000',  // NO CAMBIAR: Nombre del servicio en Docker
        changeOrigin: true,
      },
    },
  },
})
```

**IMPORTANTE:** El target del proxy usa `http://backend:3000` porque ese es el nombre del servicio en docker-compose. No cambiar a `localhost` cuando se usa Docker.

## Uso

### Comandos de Docker

#### Desarrollo

```bash
# Iniciar todos los servicios
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Reconstruir después de cambios en el código
docker-compose up --build
```

#### Producción

```bash
# Iniciar servicios de producción
docker-compose -f docker-compose.prod.yml up -d --build

# Ver estado
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Detener servicios
docker-compose -f docker-compose.prod.yml down

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart
```

### Flujo de Juego

1. **Inicio:** Usuario accede a la página principal
2. **Selección de dificultad:** Elige nivel (fácil, medio, difícil)
3. **Registro:** Completa formulario (nombre, apellido, email)
4. **Validación:** Sistema verifica disponibilidad de premios
5. **Ruleta:** Usuario gira la ruleta
6. **Pregunta:** Sistema muestra pregunta de trivia aleatoria
7. **Respuesta:** Usuario selecciona una respuesta
8. **Validación:** Sistema verifica si es correcta
9. **Premio:** Si acierta, sistema asigna premio y reduce stock
10. **Resultado:** Pantalla de premio ganado o "intentar de nuevo"

### Panel Administrativo

El sistema incluye endpoints de administración para gestionar contenido (ver sección [Endpoints de la API](#endpoints-de-la-api)).

## Estructura de Directorios

```
CrombieJuegos/
├── .gitignore              # Archivos ignorados por Git
├── README.md               # Este archivo
├── DEPLOY.md               # Guía de deployment en producción
├── docker-compose.yml      # Configuración Docker para desarrollo
├── docker-compose.prod.yml # Configuración Docker para producción
│
├── backend/                # Servidor Express.js
│   ├── .dockerignore       # Archivos ignorados por Docker
│   ├── .env                # Variables de entorno (NO commitear)
│   ├── Dockerfile          # Dockerfile para desarrollo
│   ├── Dockerfile.prod     # Dockerfile para producción
│   ├── package.json        # Dependencias del proyecto
│   ├── package-lock.json   # Lock de dependencias
│   ├── server.js           # Punto de entrada del servidor
│   ├── app.js              # Configuración de Express
│   ├── juego-mkt-*.json    # Credenciales de Google (NO commitear)
│   │
│   ├── controllers/        # Controladores de lógica de negocio
│   │   ├── preguntasController.js   # Gestión de preguntas
│   │   ├── premiosController.js     # Gestión de premios
│   │   └── emailsController.js      # Registro de participantes
│   │
│   ├── routes/             # Definición de rutas de la API
│   │   ├── preguntas.js    # Endpoints de preguntas y categorías
│   │   ├── premios.js      # Endpoints de premios
│   │   └── emails.js       # Endpoints de registro
│   │
│   ├── utils/              # Utilidades y helpers
│   │   ├── googleHandler.js    # Integración con Google APIs
│   │   └── fileHandler.js      # Manejo de archivos JSON
│   │
│   └── data/               # Datos de configuración
│       ├── data.json       # Preguntas de trivia
│       └── premios.json    # Configuración de premios
│
└── frontend/               # Aplicación React
    ├── .dockerignore       # Archivos ignorados por Docker
    ├── Dockerfile          # Dockerfile para desarrollo
    ├── Dockerfile.prod     # Dockerfile para producción
    ├── nginx.conf          # Configuración de Nginx (producción)
    ├── package.json        # Dependencias del proyecto
    ├── package-lock.json   # Lock de dependencias
    ├── vite.config.js      # Configuración de Vite
    ├── index.html          # HTML principal
    │
    ├── public/             # Archivos estáticos públicos
    │   ├── cropped2.svg    # Logo de Crombie
    │   └── fondo.svg       # Imagen de fondo
    │
    └── src/                # Código fuente React
        ├── main.jsx        # Punto de entrada de React
        ├── App.jsx         # Componente raíz con rutas
        │
        ├── pages/          # Componentes de páginas
        │   ├── Dashboard.jsx      # Página de registro
        │   ├── Home.jsx          # Página principal
        │   ├── Ruleta.jsx        # Componente de ruleta
        │   ├── slotJuego.jsx     # Juego de preguntas
        │   └── Winner.jsx        # Pantalla de premio
        │
        └── css/            # Estilos CSS
            ├── Dashboard.css
            ├── Home.css
            ├── Ruleta.css
            └── Winner.css
```

## Gestión de Contenido

### Gestión de Preguntas

El sistema permite administrar preguntas de trivia a través de la API.

#### Listar todas las preguntas

```bash
GET /api/preguntas
```

Retorna todas las categorías con sus preguntas organizadas por dificultad.

#### Agregar nueva pregunta

```bash
POST /api/agregarpregunta
Content-Type: application/json

{
  "categoria": "Historia",
  "dificultad": "medio",
  "pregunta": "¿En qué año comenzó la Segunda Guerra Mundial?",
  "respuestas": [
    { "texto": "1939", "correcta": true },
    { "texto": "1941", "correcta": false },
    { "texto": "1938", "correcta": false },
    { "texto": "1940", "correcta": false }
  ]
}
```

#### Editar pregunta existente

```bash
PUT /api/editarpreguntas/:categoria/:dificultad/:indice
Content-Type: application/json

{
  "pregunta": "Texto actualizado",
  "respuestas": [...]
}
```

#### Eliminar pregunta

```bash
DELETE /api/preguntas/:categoria/:dificultad/:indice
```

### Gestión de Categorías

#### Crear nueva categoría

```bash
POST /api/crearcategoria
Content-Type: application/json

{
  "categoria": "Ciencia"
}
```

Crea una categoría vacía con visibilidad activada y arrays vacíos para cada dificultad.

#### Eliminar categoría

```bash
DELETE /api/categorias/:categoria
```

Elimina la categoría y todas sus preguntas.

#### Cambiar visibilidad

```bash
PATCH /api/categorias/:categoria/visibilidad/:visible
```

Donde `:visible` es `true` o `false`. Las categorías ocultas no aparecen en el juego.

### Gestión de Premios

#### Listar premios

```bash
# Todos los premios
GET /api/premios

# Solo premios activos con stock
GET /api/premios/activos
```

#### Agregar premio

```bash
POST /api/premios
Content-Type: multipart/form-data

nombre: "Tablet Samsung"
descripcion: "Tablet Galaxy Tab A8"
cantidad: 5
imagen: [archivo de imagen]
activo: true
```

La imagen se sube automáticamente a Google Drive.

#### Editar premio

```bash
PUT /api/premios/:nombre
Content-Type: multipart/form-data

descripcion: "Nueva descripción"
cantidad: 10
imagen: [archivo opcional]
activo: true
```

#### Eliminar premio

```bash
DELETE /api/premios/:nombre
```

Elimina el premio y su imagen de Google Drive.

#### Modificar stock

```bash
# Descontar 1 unidad (operación atómica)
PUT /api/premios/stock/:nombre

# Establecer cantidad específica
PUT /api/premios/cantidad/:nombre
Content-Type: application/json

{
  "cantidad": 15
}
```

#### Cambiar estado

```bash
PUT /api/premios/estado/:nombre
Content-Type: application/json

{
  "activo": false
}
```

## Endpoints de la API

### Preguntas y Categorías

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/preguntas` | Lista todas las preguntas agrupadas por categoría |
| POST | `/api/agregarpregunta` | Agrega una nueva pregunta |
| PUT | `/api/editarpreguntas/:categoria/:dificultad/:indice` | Edita una pregunta existente |
| DELETE | `/api/preguntas/:categoria/:dificultad/:indice` | Elimina una pregunta |
| GET | `/api/categorias` | Lista todas las categorías |
| POST | `/api/crearcategoria` | Crea una nueva categoría |
| DELETE | `/api/categorias/:categoria` | Elimina una categoría |
| PATCH | `/api/categorias/:categoria/visibilidad/:visible` | Cambia visibilidad de categoría |

### Premios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/premios` | Lista todos los premios |
| GET | `/api/premios/activos` | Lista premios activos con stock |
| POST | `/api/premios` | Agrega un nuevo premio con imagen |
| PUT | `/api/premios/:nombre` | Edita un premio existente |
| DELETE | `/api/premios/:nombre` | Elimina un premio |
| PUT | `/api/premios/stock/:nombre` | Descuenta 1 unidad de stock (atómico) |
| PUT | `/api/premios/cantidad/:nombre` | Establece cantidad de stock |
| PUT | `/api/premios/estado/:nombre` | Cambia estado activo/inactivo |

### Registro de Participantes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/emails` | Registra email de participante |
| POST | `/api/sorteo` | Registra participante en sorteo |

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Verifica estado del servidor |

## Deploy en Producción

Para instrucciones completas de deployment en producción, consultar el archivo [DEPLOY.md](DEPLOY.md).

### Resumen de Deployment

1. Configurar archivos `.env` y credenciales de Google
2. Ejecutar: `docker-compose -f docker-compose.prod.yml up -d --build`
3. Configurar firewall del servidor (puerto 80)
4. Opcional: Configurar SSL/HTTPS con Let's Encrypt

La aplicación en producción estará disponible en el puerto 80 (HTTP) y será servida por Nginx.

## Solución de Problemas

### Los contenedores no inician

```bash
# Verificar estado de Docker
docker --version
docker ps

# Ver logs detallados
docker-compose logs
```

### Frontend no puede conectarse al backend

- Verificar que el proxy en `vite.config.js` apunte a `http://backend:3000`
- En desarrollo con Docker, NO usar `http://localhost:3000`
- Verificar que ambos contenedores estén en la misma red

```bash
# Verificar red de Docker
docker network ls
docker network inspect crombiejuegos_app_network
```

### Error al guardar en Google Sheets

- Verificar que el archivo de credenciales existe en `backend/`
- Verificar que el nombre del archivo coincide con `SERVICE_ACCOUNT_FILE` en `.env`
- Verificar que la Service Account tiene permisos de Editor en la hoja
- Verificar que la hoja tiene una pestaña llamada "eventos"

```bash
# Entrar al contenedor para verificar archivos
docker exec -it game_backend sh
ls -la
cat .env
```

### Error al subir imágenes de premios

- Verificar que `ID_CARPETA_FOTOS_PREMIOS` sea correcto
- Verificar que la Service Account tiene permisos de Editor en la carpeta
- Verificar que el archivo de imagen sea válido (JPG, PNG)
- Revisar logs del backend para errores específicos

```bash
docker-compose logs backend | grep -i "error"
```

### Preguntas no se cargan

- Verificar que `backend/data/data.json` existe y es JSON válido
- Verificar estructura del archivo (categorías → dificultad → preguntas)
- Verificar que al menos una categoría tiene `visible: true`

```bash
# Validar JSON
docker exec -it game_backend sh
cat data/data.json | python -m json.tool
```

### Puerto ya en uso

```bash
# Linux/Mac - Ver qué proceso usa el puerto
lsof -i :3000
lsof -i :5173
lsof -i :80

# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5173
netstat -ano | findstr :80

# Detener servicios en conflicto
docker-compose down
```

### Cambios en el código no se reflejan

```bash
# Reconstruir sin caché
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Error de permisos en archivos

```bash
# Linux - Dar permisos a los archivos
sudo chmod 644 backend/.env
sudo chmod 644 backend/juego-mkt-*.json
sudo chmod 644 backend/data/*.json
```

### La ruleta no gira o no muestra preguntas

- Verificar que hay preguntas en categorías visibles
- Verificar que hay premios activos con stock > 0
- Revisar la consola del navegador (F12) para errores
- Verificar la conexión del frontend al backend en Network tab

## Contribuir

Las contribuciones son bienvenidas. Por favor seguir estos pasos:

1. Hacer fork del repositorio
2. Crear una rama para el feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commitear los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

### Guías de Desarrollo

- Usar ES6+ para código JavaScript
- Seguir convenciones de React para componentes funcionales
- Mantener archivos de configuración sensibles fuera del repositorio
- Documentar funciones y componentes complejos
- Probar en desarrollo antes de hacer commit
- Validar JSON antes de modificar archivos de configuración

### Archivos Sensibles

**NUNCA commitear:**
- `.env`
- `*.json` (excepto `package.json`, `package-lock.json`)
- Archivos de credenciales de Google

El archivo `.gitignore` ya está configurado para prevenir esto.

## Licencia

Este proyecto es código privado de Crombie. Todos los derechos reservados.