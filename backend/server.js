const express = require('express');
const preguntasRoutes = require('./routes/preguntas'); // Importa las rutas de preguntas
const { leerPreguntas } = require('./utils/fileHandler');

const app = express();
const puerto = 3032;

// Middleware para las rutas de preguntas
app.use(express.json());

app.use(preguntasRoutes);

app.listen(puerto, async () => {
  try {
    console.log(`Servidor levantado en http://localhost:${puerto}`);
    
    // Usamos JSON.stringify para imprimir la estructura completa de las preguntas
  } catch (error) {
    console.error("Error al levantar servidor:", error);
  }
});