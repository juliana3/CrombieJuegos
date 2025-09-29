const express = require('express');
const preguntasRoutes = require('./routes/preguntas'); // Importa las rutas de preguntas
const premiosRoutes = require('./routes/premios'); // Importa las rutas de premios
//const emailsRoutes = require('./routes/emails'); // Importa las rutas de emails (si las tienes)
const { leerPreguntas, leerPremios } = require('./utils/fileHandler');

const app = express();
const puerto = 3000;

app.use(express.json());
//app.use(emailsRoutes);
app.use(preguntasRoutes);
app.use(premiosRoutes);

// Endpoint para obtener todos los datos 


// Endpoint para obtener todos los datos 
/*app.get('/api/datos', async (req, res) => {
  try {
    const datos = await leerDatos();  // Llama a leerDatos() que solo devuelve los datos
    res.status(200).json(datos);  // Envia los datos como respuesta en formato JSON
  } catch (error) {
    console.error("Error al leer los datos:", error);
    res.status(500).json({ error: 'Error al leer el archivo JSON' });
  }
});*/

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