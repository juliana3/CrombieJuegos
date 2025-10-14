// server.js
const express = require('express');
const cors = require('cors');
// Importa el archivo de rutas que crearemos a continuación
const preguntasRoutes = require('./routes/preguntas');
const premiosRoutes = require('./routes/premios'); // Importa las rutas de premios
const emailsRoutes = require('./routes/emails'); // Importa las rutas de emails (si las tienes)
const { leerPreguntas, leerPremios } = require('./utils/fileHandler');

const app = express();
const puerto = 3000;

app.use(express.json());
app.use(emailsRoutes);
app.use(preguntasRoutes);
app.use(premiosRoutes);

// Health check para Docker
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});


// Levantar el servidor
app.listen(puerto, async () => {
  try {
    //const datos = await leerDatos();  // Lee los datos para el inicio del servidor
    console.log(`Servidor levantado en http://localhost:${puerto}`);
    
    // Usamos JSON.stringify para imprimir la estructura completa de los datos
    //console.log('Intentando leer los datos del json:', JSON.stringify(datos, null, 2));
    // Middleware para las rutas de preguntas
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  };

});