//Aca va la logica para manejar el json con las preguntas
//**
// PUT / GET / DELETE / POST de las preguntas */
// routes/preguntas.js

const express = require('express');
// Asegúrate de importar todas las funciones que usarás.
const { listarPreguntas,listarCategorias, agregarPregunta, editarPregunta, eliminarPregunta, eliminarCategoria ,cambiarVisibilidadCategoria,crearCategoria } = require('../controllers/preguntasController');
const router = express.Router();

// Definir el endpoint GET para listar las preguntas
router.get('/api/preguntas', async (req, res) => {
  try {
    const preguntas = await listarPreguntas();
    res.status(200).json(preguntas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al leer las preguntas' });
  }
});

// Definir el endpoint GET para listar solo las categorías y su visibilidad
router.get('/api/categorias', async (req, res) => {
  try {
    const categorias = await listarCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al leer las categorías' });
  }
});



// backend/routes/preguntas.js
// Endpoint POST para agregar preguntas
router.post('/api/agregarpregunta', async (req, res) => {
    try {
        // Llamamos al controlador de la función agregarPregunta
        const resultado = await agregarPregunta(req, res);
        // Si la respuesta del controlador es una respuesta con error, ya la maneja dentro del controlador
        // Así que solo devolvemos el resultado aquí
        return resultado;
    } catch (error) {
        console.error('Error en el endpoint POST /api/agregarpregunta:', error);
        return res.status(500).json({ error: 'Error al agregar la pregunta' });
    }
});

//Agregar una nueva categoria
router.post('/api/crearcategoria', async (req, res) => {
    try {
        // Llamamos al controlador de la función agregarPregunta
        const resultado = await crearCategoria(req, res);
        // Si la respuesta del controlador es una respuesta con error, ya la maneja dentro del controlador
        // Así que solo devolvemos el resultado aquí
        return resultado;
    } catch (error) {
        console.error('Error en el endpoint POST /api/crearcategoria:', error);
        return res.status(500).json({ error: 'Error al agregar la categoria' });
    }
});


// Endpoint PUT para editar una pregunta
router.put('/api/editarpreguntas/:categoria/:dificultad/:index', async(req,res) =>{
    try{
        const resultado = await editarPregunta(req,res);
        return resultado;   
    } catch (error){
        console.error('Error en el endopint PUT /editarpreguntas',error);
    }
});
// Endpoint DELETE para eliminar una pregunta
router.delete('/api/preguntas/:categoria/:dificultad/:index', async (req,res) =>{
  try{
    const resultado = await eliminarPregunta(req,res);
    return resultado;
  } catch (error) {
    console.error('Error en el endpoint DELETE /api/preguntas/:categoria/:dificultad/:index', error);
    return res.status(500).json({ error: 'Error al eliminar la pregunta' });
  }
});

router.delete('/api/categorias/:categoria', async (req, res) => {
  try {
    const resultado = await eliminarCategoria(req, res);
    return resultado;
  } catch (error) {
    console.error(`Error en el endpoint DELETE /api/categorias/${req.params.categoria}:`, error);
    return res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});


// Endpoint PATCH para cambiar la visibilidad de una categoría
router.patch('/api/categorias/:categoria/visibilidad/:visible', async (req, res) => {
  const { categoria, visible } = req.params; // Obtenemos la categoría y el valor de "visible" desde la URL

  // Verificamos que el valor de "visible" sea un booleano válido ("true" o "false")
  const isVisible = (visible === 'true'); // Convertimos la cadena 'true' o 'false' a un booleano

  // Si el valor de "visible" no es 'true' ni 'false', respondemos con un error
  if (visible !== 'true' && visible !== 'false') {
    return res.status(400).json({ error: 'El valor de "visible" debe ser "true" o "false"' });
  }

  try {
    // Llamamos a la función que cambiará la visibilidad de la categoría
    const resultado = await cambiarVisibilidadCategoria(req, res, isVisible);

    // Devolvemos el resultado de la operación
    return resultado;
  } catch (error) {
    console.error('Error en el endpoint PATCH /api/categorias/:categoria/visibilidad', error);
    return res.status(500).json({ error: 'Error al cambiar la visibilidad de la categoría' });
  }
});


// Exportar el router para usarlo en el server.js
module.exports = router;





//Endpoint post para agregar preguntasbody: categoria, dificultad, pregunta, respuesta, incorrectas[3]

//Endpoint put editar las preguntas

//Endpoint delete para eliminar una pregunta

//Endpoint PATCH para cambiar la visibilidad de una pregunta.
