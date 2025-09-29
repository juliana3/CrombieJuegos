//*
// *configuracion de express
// *importa rutas PREGUNTAS, PREMIOS, CONFIG 
// *Manejo de errores basicos*/

const express = require('express');
const preguntasRoutes = require('./routes/preguntas');
const premiosRoutes = require('./routes/premios');
const configRoutes = require('./routes/config');

const app = express();
app.use(express.json()); // Middleware para JSON
app.use('/preguntas', preguntasRoutes); // Conecta las rutas de preguntas
app.use('/config', configRoutes); // Conecta las rutas de configuración
