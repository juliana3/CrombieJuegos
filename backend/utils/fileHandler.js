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

async function leerPremios() {
    try {
        const jsonPath = path.join(__dirname, '../data/premios.json');
        const jsonData = await fs.readFile(jsonPath, 'utf-8');
        const data = JSON.parse(jsonData);
        return data;  // Devuelve los datos leídos
    } catch (error) {
        throw new Error('Error al leer el archivo JSON');  // Lanza un error si algo falla
    }
}


export async function obtenerPremios(objDatos){
 try {
    const datos = await leerPremios()
    console.log("Datos obtenidos para premios:", datos)

    // Estructura de estadísticas con valores por defecto
    const premios = {
      buzo  {}
        
      }
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



module.exports = { leerDatos, leerPremios };


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
