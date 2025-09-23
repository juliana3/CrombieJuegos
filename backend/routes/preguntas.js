//Aca va la logica para manejar el json con las preguntas
//**
// PUT / GET / DELETE / POST de las preguntas */

const express = require('express');
const router = express.Router();
const preguntasController = require('../controllers/preguntasController'); // Importa el controlador

router.get('/', preguntasController.listarPreguntas); // Usa la función del controlador
router.post('/', preguntasController.agregarPregunta);

module.exports = router;