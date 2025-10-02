//Valida, lee y agrega las preguntas desde el json
// controllers/preguntasController.js
const {
  leerPreguntas,
  guardarPreguntas,
  leerPremios,
  guardarPremios,
  obtenerPremiosActivos
} = require('../utils/fileHandler');

const VALID_DIFICULTADES = ['facil', 'medio', 'dificil'];

function validarDificultad(d) {
  return VALID_DIFICULTADES.includes((d || '').toLowerCase());
}

// Lista todas las categorías y sus preguntas
exports.listarPreguntas = async () => {
  try {
    const preguntasData = await leerPreguntas();
    return preguntasData.categorias || {}; // Devuelve los datos directamente
  } catch (error) {
    console.error('Error en la lógica de listarPreguntas:', error);
    // Lanza el error para que el que la llamó (el router) lo maneje
    throw new Error('Error al intentar leer las preguntas desde el controlador');
  }
};

//Lista solamente las categorias con sus nombres y visibilidad
exports.listarCategorias = async () => {
  try {
    const preguntasData = await leerPreguntas();
    // Mapeamos las categorías para devolver solo el nombre y la visibilidad
    return Object.entries(preguntasData.categorias).map(([nombre, datos]) => ({
      nombre,
      visible: datos.visible
    }));
  } catch (error) {
    console.error('Error en la lógica de listarCategorias:', error);
    throw new Error('Error al intentar leer las categorías desde el controlador');
  }
};


// Agrega una pregunta a una categoría y dificultad
exports.agregarPregunta = async (req, res) => {
  const { categoria, dificultad = 'facil', pregunta, respuesta_correcta, opciones } = req.body;

  if (!categoria || !pregunta || typeof respuesta_correcta !== 'number' || respuesta_correcta < 1 || respuesta_correcta > 4 || !Array.isArray(opciones) || opciones.length !== 4) {
    return res.status(400).json({ 
      error: 'Faltan campos requeridos o formato incorrecto. Esperado: categoria, dificultad, pregunta, respuesta_correcta (número 1-4), opciones[4].' 
    });
  }

  const dif = dificultad.toLowerCase();
  if (!validarDificultad(dif)) {
    return res.status(400).json({ error: `Dificultad inválida. Valores permitidos: ${VALID_DIFICULTADES.join(', ')}` });
  }

  try {
    const preguntasData = await leerPreguntas();

    // CORRECCIÓN: Si no existe el objeto 'categorias', lo creamos.
    if (!preguntasData.categorias) {
      preguntasData.categorias = {};
    }

    // CORRECCIÓN: Si la categoría específica no existe, la creamos con su estructura completa.
    if (!preguntasData.categorias[categoria]) {
      preguntasData.categorias[categoria] = { visible: true, facil: [], medio: [], dificil: [] };
    }

    const nuevaPregunta = { pregunta, opciones, respuesta_correcta };

    // CORRECCIÓN: Accedemos a la estructura correcta: preguntasData.categorias[categoria]
    preguntasData.categorias[categoria][dif].push(nuevaPregunta);

    const ok = await guardarPreguntas(preguntasData);
    if (!ok) throw new Error('No se pudo guardar preguntas');

    // Devolver la categoría actualizada
    return res.status(201).json(preguntasData.categorias[categoria]);
  } catch (error) {
    console.error('Error agregarPregunta:', error);
    return res.status(500).json({ error: 'Error al agregar la pregunta' });
  }
};

// Crea una nueva categoría 
exports.crearCategoria = async (req, res) => {
  const { categoria, visible = true } = req.body;

  if (!categoria || typeof categoria !== 'string') {
    return res.status(400).json({
      error: 'Falta el nombre de la categoría o no es válido. Se espera un nombre de categoría como string.'
    });
  }

  try {
    const preguntasData = await leerPreguntas();

    // Si ya existe la categoría, retornamos un error
    if (preguntasData.categorias && preguntasData.categorias[categoria]) {
      return res.status(400).json({ error: `La categoría '${categoria}' ya existe.` });
    }

    // Crear la nueva categoría con la estructura base
    if (!preguntasData.categorias) {
      preguntasData.categorias = {};
    }

    // La categoría tiene que tener una estructura con las preguntas vacías por dificultad
    preguntasData.categorias[categoria] = { visible, facil: [], medio: [], dificil: [] };

    // Guardamos los datos actualizados
    const ok = await guardarPreguntas(preguntasData);
    if (!ok) throw new Error('No se pudo guardar las preguntas después de crear la categoría.');

    // Respondemos con la nueva categoría creada
    return res.status(201).json(preguntasData.categorias[categoria]);
  } catch (error) {
    console.error('Error crearCategoria:', error);
    return res.status(500).json({ error: 'Error al crear la categoría' });
  }
};





// Edita una pregunta por índice en una categoría y dificultad
// Params esperados: /preguntas/:categoria/:dificultad/:index
// Body: { pregunta?, respuesta?, incorrectas? }
exports.editarPregunta = async (req, res) => {
  const { categoria, dificultad, index } = req.params;
  const { pregunta, respuesta_correcta, opciones } = req.body;

  const idx = parseInt(index, 10);
  if (Number.isNaN(idx) || idx < 0) {
    return res.status(400).json({ error: 'Index inválido' });
  }
  const dif = (dificultad || '').toLowerCase();
  if (!validarDificultad(dif)) {
    return res.status(400).json({ error: `Dificultad inválida. Valores permitidos: ${VALID_DIFICULTADES.join(', ')}` });
  }

  try {
    const preguntasData = await leerPreguntas();
    if (!preguntasData.categorias || !preguntasData.categorias[categoria] || !Array.isArray(preguntasData.categorias[categoria][dif])) {
      return res.status(404).json({ error: 'Categoría o dificultad no encontrada' });
    }

    const listado = preguntasData.categorias[categoria][dif];
    if (idx >= listado.length) {
      return res.status(404).json({ error: 'Pregunta no encontrada en ese índice' });
    }

    const preguntaExistente = listado[idx];

    // Actualizamos campos si vienen
    if (pregunta) preguntaExistente.pregunta = pregunta;
if (typeof respuesta_correcta === 'number' && respuesta_correcta >= 1 && respuesta_correcta <= 4) {
  preguntaExistente.respuesta_correcta = respuesta_correcta;
}


    if (opciones && Array.isArray(opciones) && opciones.length === 4) {
      preguntaExistente.opciones = opciones;
    }

    const ok = await guardarPreguntas(preguntasData);
    if (!ok) throw new Error('No se pudo guardar preguntas');

    return res.json(preguntaExistente);
  } catch (error) {
    console.error('Error editarPregunta:', error);
    return res.status(500).json({ error: 'Error al editar la pregunta' });
  }
};

// Elimina pregunta por categoria/dificultad/index
exports.eliminarPregunta = async (req, res) => {
  const { categoria, dificultad, index } = req.params;
  const idx = parseInt(index, 10);
  if (Number.isNaN(idx) || idx < 0) {
    return res.status(400).json({ error: 'Index inválido' });
  }
  const dif = (dificultad || '').toLowerCase();
  if (!validarDificultad(dif)) {
    return res.status(400).json({ error: `Dificultad inválida. Valores permitidos: ${VALID_DIFICULTADES.join(', ')}` });
  }

  try {
    const preguntasData = await leerPreguntas();
    if (!preguntasData.categorias || !preguntasData.categorias[categoria] || !Array.isArray(preguntasData.categorias[categoria][dif])) {
      return res.status(404).json({ error: 'Categoría o dificultad no encontrada' });
    }

    const listado = preguntasData.categorias[categoria][dif];
    if (idx >= listado.length) {
      return res.status(404).json({ error: 'Pregunta no encontrada en ese índice' });
    }

    listado.splice(idx, 1);

    const ok = await guardarPreguntas(preguntasData);
    if (!ok) throw new Error('No se pudo guardar preguntas');

    return res.json({ message: 'Pregunta eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminarPregunta:', error);
    return res.status(500).json({ error: 'Error al eliminar la pregunta' });
  }
};

// Cambia la visibilidad de la categoría (habilitado/deshabilitado)
exports.cambiarVisibilidadCategoria = async (req, res, visible) => {
  const { categoria } = req.params;

  try {
    const preguntasData = await leerPreguntas();
    if (!preguntasData.categorias || !preguntasData.categorias[categoria]) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Asignamos directamente el valor de "visible" recibido en la solicitud
    const catObj = preguntasData.categorias[categoria];
    catObj.visible = visible;

    // Guardamos los datos modificados
    const ok = await guardarPreguntas(preguntasData);
    if (!ok) throw new Error('No se pudo guardar preguntas');

    // Respondemos con la categoría y su nuevo estado de visibilidad
    return res.json({ categoria, visible: catObj.visible });
  } catch (error) {
    console.error('Error cambiarVisibilidadCategoria:', error);
    return res.status(500).json({ error: 'Error al cambiar la visibilidad de la categoría' });
  }
};
// En controllers/preguntasController.js

exports.eliminarCategoria = async (req, res) => {
  const { categoria } = req.params;

  if (!categoria) {
    return res.status(400).json({ error: 'Se debe especificar la categoría a eliminar' });
  }

  try {
    const preguntasData = await leerPreguntas();

    if (!preguntasData.categorias || !preguntasData.categorias[categoria]) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Eliminar la categoría
    delete preguntasData.categorias[categoria];

     if (Object.keys(preguntasData.categorias).length === 0) {
       preguntasData.categorias = {};
    }

    const ok = await guardarPreguntas(preguntasData);
    if (!ok) throw new Error('No se pudo guardar después de eliminar la categoría');

    return res.json({ message: `Categoría '${categoria}' eliminada correctamente` });
  } catch (error) {
    console.error('Error eliminarCategoria:', error);
    return res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
};





//editar pregunta 

//eliminar pregunta

//Cambiar estado de visibilidad de categoria



