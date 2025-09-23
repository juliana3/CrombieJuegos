//Editar, eliminar premios existentes
//listar premios disponibles
//descuenta stock al ganar
//activa - desactiva premios

const path = require('path');
const fileHandler = require('../utils/fileHandler');
const googleDrive = require('../utils/googleHandler')
const premiosPath = path.join(__dirname, '..', 'data', 'premios.json');


// Listar todos los premios
exports.ListarPremios = (req, res) => {
    try {
        const premiosData = fileHandler.leerDatos(premiosPath)
        res.json(premiosData.premios);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los premios' });
    }
};

// Agregar un nuevo premio
exports.agregarPremio = (req, res) => {
    const {nombre, activo, cantidad, imagen} = req.body;
    try {
        const premiosData = fileHandler.leerDatos(premiosPath);

        if (premiosData.premios[nombre]){
            return res.status(400).json({ message: 'El premio ya existe' });
        }

        premiosData.premios.push(nuevoPremio);
        fileHandler.escribirDatos(premiosPath, premiosData);
        res.status(201).json(nuevoPremio);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el premio' });
    }
};
