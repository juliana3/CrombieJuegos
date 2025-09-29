//PREMIOACONTROLLER --> 
//Editar, eliminar premios existentes
//listar premios disponibles
//descuenta stock al ganar
//activa - desactiva premios

const path = require('path');
const fileHandler = require('../utils/fileHandler');
const googleDrive = require('../utils/googleHandler')
const premiosPath = path.join(__dirname, '..', 'data', 'premios.json');
const { google } = require('googleapis');

// Listar todos los premios
exports.listarPremios = (req, res) => {
    try {
        const premiosData = fileHandler.leerPremios()
        res.json(premiosData.premios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al listar los premios' });
    }
};

// Asegúrate de que esta ruta sea correcta para tu proyecto

// Agregar un nuevo premio  //FUNCIONA
exports.agregarPremio = async (req, res) => {
    try {
        const { nombre } = req.body; // Multer ya ha procesado los datos del formulario
        
        // Verifica que se haya proporcionado el nombre
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del premio es obligatorio.' });
        }

        const premiosData = await fileHandler.leerDatos(premiosPath);

        if (premiosData.premios[nombre]){
            return res.status(400).json({ message: 'El premio ya existe' });
        }

        // Define los valores por defecto
        const nuevoPremio = {
            activo: false,
            cantidad: 0,
            imagen: null
        };

        // Si se subió una imagen, la subimos a Google Drive
        if (req.file){
            const fileId = await googleDrive.subirImagenADrive(req.file.buffer, `${nombre}.jpg`);
            nuevoPremio.imagen = fileId;
        }

        // Guarda los datos en el archivo JSON
        premiosData.premios[nombre] = nuevoPremio;
        await fileHandler.escribirDatos(premiosPath, premiosData);

        res.status(201).json({nombre, ...nuevoPremio});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el premio' });
    }
};


// EDITAR NOMBRE O IMAGEN DEL PREMIO // FUNCIONA, pero..
//TODO: FIJARME POR QUE SUBE LA FOO MAS DE UNA VEZ SI YA ESTA EL PREMIO, O CUANDO SSE EDITAAAAAA
exports.editarPremio = async (req, res) => {
    const { nombre } = req.params;
    const { nuevoNombre } = req.body;

    try {
        const premiosData = await fileHandler.leerDatos(premiosPath); // Usa 'await'
        
        if (!premiosData.premios[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const premio = premiosData.premios[nombre];

        // Se usa para las operaciones de renombrar o borrar en Drive
        const auth = await googleDrive.getAuthService();
        const drive = google.drive({ version: 'v3', auth });

        // Renombrar premio (sin imagen nueva)
        if (nuevoNombre && !req.file) {
            if (premio.imagen) {
                // Renombrar imagen en Drive
                await drive.files.update({
                    fileId: premio.imagen,
                    resource: { name: `${nuevoNombre}.jpg` },
                    supportsAllDrives: true,
                });
            }

            // Actualizar en JSON
            premiosData.premios[nuevoNombre] = { ...premio };
            delete premiosData.premios[nombre];
            await fileHandler.escribirDatos(premiosPath, premiosData); // Usa 'await'
            
            return res.status(200).json({ message: 'Nombre actualizado correctamente' });
        }

        // Reemplazar imagen
        if (req.file) {
            // Borrar imagen anterior en Drive si existía
            if (premio.imagen) {
                await drive.files.delete({
                    fileId: premio.imagen,
                    supportsAllDrives: true,
                });
            }

            // Subir nueva imagen
            const nombreFinal = nuevoNombre || nombre;
            const fileIdNuevo = await googleDrive.subirImagenADrive(req.file.buffer, `${nombreFinal}.jpg`);

            // Actualizar JSON
            if (nuevoNombre) {
                premiosData.premios[nuevoNombre] = { ...premio, imagen: fileIdNuevo };
                delete premiosData.premios[nombre];
            } else {
                premiosData.premios[nombre].imagen = fileIdNuevo;
            }

            await fileHandler.escribirDatos(premiosPath, premiosData); // Usa 'await'
            return res.status(200).json({ message: 'Imagen actualizada correctamente', fileId: fileIdNuevo });
        }

        res.status(400).json({ message: 'No se recibieron cambios' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al editar el premio' });
    }
};


// Eliminar un premio
exports.eliminarPremio = async (req, res) => {
    const { nombre } = req.params;

    try {
        const premiosData = fileHandler.leerDatos(premiosPath);

        if (!premiosData.premios[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const premio = premiosData.premios[nombre];

        // Si tiene imagen en Drive, la borramos
        if (premio.imagen) {
            const driveService = await googleDrive.getDriveService();
            if (driveService) {
                try {
                    await driveService.files.delete({
                        fileId: premio.imagen,
                        supportsAllDrives: true,
                    });
                    console.log(`Imagen de ${nombre} eliminada en Drive`);
                } catch (e) {
                    console.error(`Error al eliminar la imagen en Drive:`, e);
                    // no hay return porque aunque falle lo de Drive, igual se del JSON
                }
            }
        }

        // Eliminar del JSON
        delete premiosData.premios[nombre];
        fileHandler.escribirDatos(premiosPath, premiosData);

        res.json({ message: `Premio '${nombre}' eliminado correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el premio' });
    }
};


// CAMBIAR ESTADO (activar / desactivar)
exports.cambiarEstadoPremio = (req, res) => {
    const { nombre } = req.params;
    const { activo } = req.body; // true o false

    try {
        const premiosData = fileHandler.leerDatos(premiosPath);

        if (!premiosData.premios[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        premiosData.premios[nombre].activo = Boolean(activo);
        fileHandler.escribirDatos(premiosPath, premiosData);

        res.json({
            message: `Premio '${nombre}' ${activo ? 'activado' : 'desactivado'} correctamente`,
            premio: { nombre, ...premiosData.premios[nombre] }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar estado del premio' });
    }
};

// DESCONTAR STOCK AL GANAR UN PREMIO
exports.descontarStock = (req, res) => {
    const { nombre } = req.params;

    try {
        const premiosData = fileHandler.leerDatos(premiosPath);

        if (!premiosData.premios[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const premio = premiosData.premios[nombre];

        if (premio.cantidad <= 0) {
            return res.status(400).json({ message: 'Sin stock disponible' });
        }

        premio.cantidad -= 1;

        fileHandler.escribirDatos(premiosPath, premiosData);

        res.json({
            message: `Se descontó 1 unidad del premio '${nombre}'.`,
            premio: { nombre, ...premio }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al descontar stock' });
    }
};


// MODIFICAR CANTIDAD DE PREMIOS DISPONIBLES (+ o -)
exports.modificarCantidadPremio = (req, res) => {
    const { nombre } = req.params;
    const { cantidad } = req.body; // número nuevo

    try {
        const premiosData = fileHandler.leerDatos(premiosPath);

        if (!premiosData.premios[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const nuevaCantidad = parseInt(cantidad, 10); //convierte a int y lopone en base 10

        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
            return res.status(400).json({ message: 'La cantidad debe ser un número mayor o igual a 0' });
        }

        premiosData.premios[nombre].cantidad = nuevaCantidad;

        fileHandler.escribirDatos(premiosPath, premiosData);

        res.json({
            message: `Cantidad del premio '${nombre}' actualizada a ${nuevaCantidad}.`,
            premio: { nombre, ...premiosData.premios[nombre] }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al modificar la cantidad del premio' });
    }
};
