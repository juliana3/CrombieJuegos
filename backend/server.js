const express = require('express');
<<<<<<< HEAD
const emailsRoutes = require('./routes/emails.js');
const premiosRoutes = require('./routes/premios.js');
const { leerDatos } = require('./utils/fileHandler.js');
=======
const preguntasRoutes = require('./routes/preguntas'); // Importa las rutas de preguntas
const { leerPreguntas } = require('./utils/fileHandler');
>>>>>>> f6daf3fa524d219ef6f5f90b339a515865fa0425

const app = express();
const puerto = 3032;

<<<<<<< HEAD
app.use(express.json());
app.use(emailsRoutes);
app.use(premiosRoutes);

// Endpoint para obtener todos los datos 
app.get('/listar_premios', async (req, res) => {
  try {
    const datos = await leerDatos();  // Llama a leerDatos() que solo devuelve los datos
    res.status(200).json(datos);  // Envia los datos como respuesta en formato JSON
  } catch (error) {
    console.error("Error al leer los datos:", error);
    res.status(500).json({ error: 'Error al leer el archivo JSON' });
  }
});

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
=======
// Middleware para las rutas de preguntas
app.use(express.json());

app.use(preguntasRoutes);

app.listen(puerto, async () => {
  try {
    console.log(`Servidor levantado en http://localhost:${puerto}`);
    
    // Usamos JSON.stringify para imprimir la estructura completa de las preguntas
>>>>>>> f6daf3fa524d219ef6f5f90b339a515865fa0425
  } catch (error) {
    console.error("Error al levantar servidor:", error);
  }
<<<<<<< HEAD
});

=======
});
>>>>>>> f6daf3fa524d219ef6f5f90b339a515865fa0425
