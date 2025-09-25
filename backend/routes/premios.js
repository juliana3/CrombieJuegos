/// Aca va la logica para manejar el CRUD de premios

//**
// POST / PUT / DELETE / GET de los premios
// Guardado de las imagenes de los premios en drive
//  */


const express = require('express');
const router = express.Router();
const multer = require('multer');

//define el almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const premiosController = require('../controllers/premiosController');

// Rutas para manejar los premios

//LISTA LOS PREMIOS
router.get('/', premiosController.listarPremios);

//SUBIR IMAGEN PREMIO
router.post('/', upload.single('imagen-premio'), premiosController.agregarPremio)

//AGREGAR PREMIO
router.post('/', premiosController.agregarPremio);

//EDITAR PREMIO
router.put('/:nombre', premiosController.editarPremio);

//ELIMINAR PREMIO
router.delete('/:nombre', premiosController.eliminarPremio);

//DESCONTAR STOCK
router.put('/stock/:nombre', premiosController.descontarStock);

//ACTIVAR/DESACTIVAR PREMIO
router.put('/estado/:nombre', premiosController.cambiarEstadoPremio);

module.exports = router;
