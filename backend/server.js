const express = require('express');
const { leerDatos } = require('./utils/fileHandler.js');

const app = express();
const puerto = 3000;

// Endpoint para obtener todos los datos 
app.get('/api/datos', async (req, res) => {
  try {
    const datos = await leerDatos();  // Llama a leerDatos() que solo devuelve los datos
    res.status(200).json(datos);  // Envia los datos como respuesta en formato JSON
  } catch (error) {
    console.error("Error al leer los datos:", error);
    res.status(500).json({ error: 'Error al leer el archivo JSON' });
  }
});

// Levantar el servidor
app.listen(puerto, async () => {
  try {
    const datos = await leerDatos();  // Lee los datos para el inicio del servidor
    console.log(`Servidor levantado en http://localhost:${puerto}`);
    
    // Usamos JSON.stringify para imprimir la estructura completa de los datos
    console.log('Intentando leer los datos del json:', JSON.stringify(datos, null, 2));
  } catch (error) {
    console.error("Error al leer los datos en el inicio del servidor:", error);
  }
});
