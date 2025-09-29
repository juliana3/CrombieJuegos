// fileHandler.js
const fs = require('fs/promises');
const path = require('path');

// Maneja la lectura de archivos JSON
async function leerDatos(jsonPath) {
    try {
        console.log('Intentando leer el archivo en:', jsonPath);
        const jsonData = await fs.readFile(jsonPath, 'utf-8');
        const data = JSON.parse(jsonData);
        return data;
    } catch (error) {
        console.error("Error al leer el archivo JSON:", error);
        throw new Error('Error al leer el archivo JSON');
    }
}

// Maneja la escritura de archivos JSON
async function escribirDatos(jsonPath, data) {
    try {
        await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
        console.log("Datos guardados exitosamente.");
        return true;
    } catch (error) {
        console.error("Error al guardar datos:", error);
        return false;
    }
}

module.exports = { leerDatos, escribirDatos };