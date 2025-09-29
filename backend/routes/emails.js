//Aca va la logica para los emails que ingresan los participantes
/**
 * Se ingresa un correo electronico y se guarda een un sheets, junto on la fecha
 */

const express = require('express');
const router = express.Router();
const emailsController = require('../controllers/emailsController');

console.log('Rutas de emails cargadas')

// Ruta para guardar mails
router.post('/emails', emailsController.guardarMail);

module.exports = router;
