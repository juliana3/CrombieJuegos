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


// Lee todos los premios
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


/*export async function leerDatos() {
  try {
    const datosRecibidos = await window.electronAPI.leerDatos()
    if (!datosRecibidos) {
      return { palabras: [], estadisticas: { ganadas: 0, perdidas: 0 } }
    }
    if (typeof datosRecibidos === "string") {
      return JSON.parse(datosRecibidos)
    }
    return datosRecibidos
  } catch (err) {
    console.error("Error en leerDatos:", err)
    return { palabras: [], estadisticas: { ganadas: 0, perdidas: 0 } }
  }
}

export async function guardarDatos(objDatos) {
  try {
    const respuesta = await window.electronAPI.guardarDatos(objDatos)
    console.log("Respuesta de guardarDatos:", respuesta)

    // La respuesta ahora es un objeto con success: boolean
    return respuesta && respuesta.success
  } catch (err) {
    console.error("Error en guardarDatos:", err)
    return false
  }
}

export async function obtenerEstadisticas() {
  try {
    const datos = await leerDatos()
    console.log("Datos obtenidos para estadísticas:", datos)

    // Estructura de estadísticas con valores por defecto
    const estadisticasDefault = {
      partidasJugadas: 0,
      partidasGanadas: 0,
      partidasPerdidas: 0,
      porcentajeExito: 0,
      tiempoTotalJugado: 0,
    }

    return {
      globales: datos.estadisticas || estadisticasDefault,
      porPalabra: datos.estadisticasPorPalabra || {},
      historial: datos.historial || [],
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return {
      globales: {
        partidasJugadas: 0,
        partidasGanadas: 0,
        partidasPerdidas: 0,
        porcentajeExito: 0,
        tiempoTotalJugado: 0,
      },
      porPalabra: {},
      historial: [],
    }
  }
}

export async function actualizarEstadisticas(resultado) {
  try {
    const respuesta = await window.electronAPI.actualizarEstadisticas(resultado)
    return respuesta && respuesta.success
  } catch (error) {
    console.error("Error actualizando estadísticas:", error)
    return false
  }
}
 */
