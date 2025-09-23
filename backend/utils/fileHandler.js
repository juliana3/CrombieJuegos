//**
// Maneja la lectura y escritura de archivos JSON
// 
const fs = require('fs/promises');
const path = require('path');

// Esta función solo lee y devuelve los datos
async function leerDatos() {
    try {
        const jsonPath = path.join(__dirname, '../data/data.json');
        const jsonData = await fs.readFile(jsonPath, 'utf-8');
        const data = JSON.parse(jsonData);
        return data;  // Devuelve los datos leídos
    } catch (error) {
        throw new Error('Error al leer el archivo JSON');  // Lanza un error si algo falla
    }
}

module.exports = { leerDatos };

