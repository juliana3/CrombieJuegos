/// PREMIOS.JS --> Aca va la logica para manejar el CRUD de premios

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

//agregar PREMIO con img opcional
router.post('/crear', upload.single('imagen-premio'), premiosController.agregarPremio)

//EDITAR PREMIO
router.put('/:nombre', upload.single('imagen-premio'), premiosController.editarPremio);

//ELIMINAR PREMIO
router.delete('/:nombre', premiosController.eliminarPremio);

//DESCONTAR STOCK (cuando ganan un premio)
router.put('/stock/:nombre', premiosController.descontarStock);

//ACTIVAR/DESACTIVAR PREMIO
router.put('/estado/:nombre', premiosController.cambiarEstadoPremio);

//MODIFICAR CANTIDAD (+ o - premios disppnibles para el evento)
router.patch('/:nombre/cantidad', premiosController.modificarCantidadPremio);

module.exports = router;
