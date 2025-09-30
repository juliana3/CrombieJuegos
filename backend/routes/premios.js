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


// Función de utilidad para manejar errores asíncronos (async/await)
// Envuelve las funciones del controlador para que los errores sean atrapados y respondan con 500
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error('Error en el endpoint:', req.path, err);
        // Si el controlador no maneja el error, devolvemos un error 500 genérico.
        res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud.' });
    });
};


// Rutas para manejar los premios

//LISTA LOS PREMIOS // FUNCIONAAAAA
router.get('/api/premios', asyncHandler(premiosController.listarPremios));

//agregar PREMIO con img opcional  ///FUNCIONAAAAAAAAAA
router.post('/api/premios/crear', upload.single('imagen-premio'), asyncHandler(premiosController.agregarPremio)) 

//EDITAR PREMIO   // FUNCIONAAAAAAA
router.put('/api/premios/editar/:nombre', upload.single('imagen-premio'), asyncHandler(premiosController.editarPremio));

//ELIMINAR PREMIO    // FUNCIONAAAAAA
router.delete('/api/premios/eliminar/:nombre', asyncHandler(premiosController.eliminarPremio));

//DESCONTAR STOCK (cuando ganan un premio)    ///FUNCIONAAAAAA
router.put('/api/premios/stock/:nombre', asyncHandler(premiosController.descontarStock));

//ACTIVAR/DESACTIVAR PREMIO   //FUNCIONAAAAAA
router.put('/api/premios/estado/:nombre/:valor', asyncHandler(premiosController.cambiarEstadoPremio));

//MODIFICAR CANTIDAD (+ o - premios disppnibles para el evento)   //FUNCIONAAAAAA
router.patch('/api/premios/cantidad/:nombre/:cantidad', asyncHandler(premiosController.modificarCantidadPremio));

//MOSTRAR LOS PREMIOS ACTIVOS (estado=true)  //FUNCIONAAAAAA
router.get('/api/premios/activos', asyncHandler(premiosController.listarPremiosActivos));

module.exports = router;
