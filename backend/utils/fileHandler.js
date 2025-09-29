// Maneja la lectura y escritura de archivos JSON
const fs = require('fs/promises');
const path = require('path');

// Paths a los archivos JSON
const preguntasPath = path.join(__dirname, '../data/data.json');
const premiosPath = path.join(__dirname, '../data/premios.json');


// Lee todas las categorías y preguntas
async function leerPreguntas() {
  try {
    const jsonData = await fs.readFile(preguntasPath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error al leer preguntas:", error);
    return { categorias: {} };
  }
}

// Escribe en el archivo de preguntas
async function guardarPreguntas(data) {
  try {
    await fs.writeFile(preguntasPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error al guardar preguntas:", error);
    return false;
  }
}


// Lee todos los premios: Lista todos los premips
async function leerPremios() {
  try {
    const jsonData = await fs.readFile(premiosPath, 'utf-8');
    return JSON.parse(jsonData).premios || {};
  } catch (error) {
    console.error("Error al leer premios:", error);
    return {};
  }
}

// Escribe en el archivo de premios 
async function guardarPremios(data) {
  try {
    await fs.writeFile(premiosPath, JSON.stringify({ premios: data }, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Error al guardar premios:", error);
    return false;
  }
}


// Devuelve premios activos (para ruleta o sorteos)
async function obtenerPremiosActivos() {
  try {
    const premios = await leerPremios();
    const activos = Object.entries(premios)
      .filter(([_, p]) => p.activo && p.cantidad > 0)
      .map(([nombre, p]) => ({
        nombre,
        cantidad: p.cantidad,
        imagen: p.imagen
      }));
    return activos;
  } catch (error) {
    console.error("Error obteniendo premios activos:", error);
    return [];
  }
}



module.exports = {
  leerPreguntas,
  guardarPreguntas,
  leerPremios,
  guardarPremios,
  obtenerPremiosActivos
};



