//Aca va la logica para manejar el json con las preguntas
//**
// PUT / GET / DELETE / POST de las preguntas */
// routes/preguntas.js

const express = require('express');
// Asegúrate de importar todas las funciones que usarás.
const { listarPreguntas, agregarPregunta, editarPregunta, eliminarPregunta, cambiarVisibilidadCategoria } = require('../controllers/preguntasController');
const router = express.Router();

// Definir el endpoint GET para listar las preguntas
router.get('/api/preguntas', async (req, res) => {
  try {
    // La llamada es la misma, pero ahora la función SÍ devuelve los datos.
    const preguntas = await listarPreguntas();
    res.status(200).json(preguntas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al leer las preguntas' });
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



// Endpoint PUT para editar una pregunta
router.put('/api/preguntas/:categoria/:dificultad/:index', editarPregunta);

// Endpoint DELETE para eliminar una pregunta
router.delete('/api/preguntas/:categoria/:dificultad/:index', eliminarPregunta);

// Endpoint PATCH para cambiar la visibilidad de una categoría
router.patch('/api/categorias/:categoria/visibilidad', cambiarVisibilidadCategoria);


// Exportar el router para usarlo en el server.js
module.exports = router;





//Endpoint post para agregar preguntasbody: categoria, dificultad, pregunta, respuesta, incorrectas[3]

//Endpoint put editar las preguntas

//Endpoint delete para eliminar una pregunta

//Endpoint PATCH para cambiar la visibilidad de una pregunta.
