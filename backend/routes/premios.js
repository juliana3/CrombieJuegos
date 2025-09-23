/// Aca va la logica para manejar el CRUD de premios

//**
// POST / PUT / DELETE / GET de los premios
// Guardado de las imagenes de los premios en drive
//  */


const express = require('express');
const router = express.Router();
const premiosController = require('../controllers/premiosController');

// Rutas para manejar los premios

//LISTA LOS PREMIOS
router.get('/', premiosController.ListarPremios);

//AGREGAR PREMIO
router.post('/', premiosController.AgregarPremio);

//EDITAR PREMIO
router.put('/:nombre', premiosController.EditarPremio);

//ELIMINAR PREMIO
router.delete('/:nombre', premiosController.EliminarPremio);

//DESCONTAR STOCK
router.put('/stock/:nombre', premiosController.DescontarStock);

//ACTIVAR/DESACTIVAR PREMIO
router.put('/estado/:nombre', premiosController.cambiarEstadoPremio);

module.exports = router;
