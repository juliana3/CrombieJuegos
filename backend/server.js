// server.js
const express = require('express');
const cors = require('cors');
// Importa el archivo de rutas que crearemos a continuación
const preguntasRoutes = require('./routes/preguntas');
const premiosRoutes = require('./routes/premios');

const app = express();
const puerto = 3000;

// Configurar CORS para permitir peticiones desde tu frontend
app.use(cors({
  origin: "http://localhost:5173"
}));

// Middleware para que Express pueda entender cuerpos de petición en formato JSON
app.use(express.json());

// **Línea clave:** Todas las rutas definidas en preguntasRoutes comenzarán con /api
app.use(preguntasRoutes);
app.use(premiosRoutes);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware para manejo de errores generales del servidor (500)
app.use((err, req, res, next) => {
  console.error('Error global del servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(puerto, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${puerto}`);
});