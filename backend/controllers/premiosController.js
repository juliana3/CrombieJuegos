//PREMIOACONTROLLER --> 
//Editar, eliminar premios existentes
//listar premios disponibles
//descuenta stock al ganar
//activa - desactiva premios

const path = require('path');
const {leerPremios, guardarPremios, obtenerPremiosActivos} = require('../utils/fileHandler');
const googleDrive = require('../utils/googleHandler')
const { google } = require('googleapis');


// Listar todos los premios
exports.listarPremios = async (req, res) => {
    try {
        const premiosData = await leerPremios()
        return res.status(200).json(premiosData || {});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener la lista de premios' });
    }
};


// Agregar un nuevo premio  //FUNCIONA
exports.agregarPremio = async (req, res) => {
    try {
        const { nombre } = req.body; // Multer ya ha procesado los datos del formulario
        
        // Verifica que se haya proporcionado el nombre
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre del premio es obligatorio.' });
        }

        const premiosData = await leerPremios();

        if (premiosData[nombre]){
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
        premiosData[nombre] = nuevoPremio;
        await guardarPremios(premiosData);

        res.status(201).json({nombre, ...nuevoPremio});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el premio' });
    }
};


// EDITAR NOMBRE O IMAGEN DEL PREMIO // FUNCIONA
exports.editarPremio = async (req, res) => {
    const { nombre } = req.params;
    const { nuevoNombre } = req.body;

    try {
        const premiosData = await leerPremios(); // Usa 'await'
        
        if (!premiosData[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const premio = premiosData[nombre];

        // Se usa para las operaciones de renombrar o borrar en Drive
        const drive = await googleDrive.getDriveService(); // Obtiene la instancia de drive lista para usar

        // Comprobación de seguridad
        if (!drive) {
            console.error('No se pudo obtener el servicio de Google Drive.');
            return res.status(500).json({ error: 'Error de autenticación con Google Drive' });
        }

        // Renombrar premio (sin imagen nueva)
        if (nuevoNombre && !req.file) {
            if (premio.imagen) {
                // Renombrar imagen en Drive
                try {
                    await drive.files.update({
                        fileId: premio.imagen,
                        resource: { name: `${nuevoNombre}.jpg` },
                        supportsAllDrives: true,
                    });
                    console.log(`Imagen renombrada en Drive a ${nuevoNombre}.jpg`);
                } catch (e) {
                    if (e.code === 404) {
                        console.warn(`Archivo anterior '${premio.imagen}' no se encontró en Drive, se ignora.`);
                    }else{
                        throw e;
                    }
                }
                
            }

            // Actualizar en JSON
            premiosData[nuevoNombre] = { ...premio };
            delete premiosData[nombre];
            await guardarPremios(premiosData); // Usa 'await'
            
            return res.status(200).json({ message: 'Nombre actualizado correctamente' });
        }

        // Reemplazar imagen
        if (req.file) {
            // Borrar imagen anterior en Drive si existía
            if (premio.imagen) {
                try{
                    await drive.files.delete({
                        fileId: premio.imagen,
                        supportsAllDrives: true,
                    });
                    console.log(`Imagen anterior de ${nombre} eliminada en Drive`);
                }catch(e){
                    if (e.code === 404) {
                        console.warn(`Archivo anterior '${premio.imagen}' no se encontró en Drive, se ignora.`);
                    }else{
                        throw e;
                    }
                }
                
            }

            // Subir nueva imagen
            const nombreFinal = nuevoNombre || nombre;
            const fileIdNuevo = await googleDrive.subirImagenADrive(req.file.buffer, `${nombreFinal}.jpg`);

            // Actualizar JSON
            if (nuevoNombre) {
                premiosData[nuevoNombre] = { ...premio, imagen: fileIdNuevo };
                delete premiosData[nombre];
            } else {
                premiosData[nombre].imagen = fileIdNuevo;
            }

            await guardarPremios(premiosData); // Usa 'await'

            return res.status(200).json({ message: 'Imagen actualizada correctamente', fileId: fileIdNuevo });
        }

        res.status(400).json({ message: 'No se recibieron cambios' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al editar el premio' });
    }
};


// Eliminar un premio   //FUNCIONA
exports.eliminarPremio = async (req, res) => {
    const { nombre } = req.params;

    try {
        const premiosData = await leerPremios();

        if (!premiosData[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const premio = premiosData[nombre];

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
        delete premiosData[nombre];
        await guardarPremios(premiosData);

        res.json({ message: `Premio '${nombre}' eliminado correctamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el premio' });
    }
};


// CAMBIAR ESTADO (activar / desactivar)  // FUNCIONA
exports.cambiarEstadoPremio = async (req, res) => {
    const { nombre, valor } = req.params;

    try {
        const premiosData = await leerPremios();

        if (!premiosData[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const esta_activado = valor === 'true' || valor === '1';

        premiosData[nombre].activo = esta_activado;
        await guardarPremios(premiosData);

        res.json({
            message: `Premio '${nombre}' ${esta_activado ? 'activado' : 'desactivado'} correctamente`,
            premio: { nombre, ...premiosData[nombre] }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar estado del premio' });
    }
};

// DESCONTAR STOCK AL GANAR UN PREMIO  // FUNCIONA
exports.descontarStock = async (req, res) => {
    const { nombre } = req.params;

    try {
        const premiosData = await leerPremios();

        if (!premiosData[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const premio = premiosData[nombre];

        if (premio.cantidad <= 0) {
            return res.status(400).json({ message: 'Sin stock disponible' });
        }

        premio.cantidad -= 1;

        await guardarPremios(premiosData);

        res.json({
            message: `Se descontó 1 unidad del premio '${nombre}'.`,
            premio: { nombre, ...premio }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al descontar stock' });
    }
};


// MODIFICAR CANTIDAD DE PREMIOS DISPONIBLES (+ o -)  //FUNCIONA
exports.modificarCantidadPremio = async (req, res) => {
    const { nombre, cantidad } = req.params;

    try {
        const premiosData = await leerPremios();

        if (!premiosData[nombre]) {
            return res.status(404).json({ message: 'Premio no encontrado' });
        }

        const nuevaCantidad = parseInt(cantidad, 10); //convierte a int y lo pone en base 10

        if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
            return res.status(400).json({ message: 'La cantidad debe ser un número mayor o igual a 0' });
        }

        premiosData[nombre].cantidad = nuevaCantidad;

        await guardarPremios(premiosData);

        res.json({
            message: `Cantidad del premio '${nombre}' actualizada a ${nuevaCantidad}.`,
            premio: { nombre, ...premiosData[nombre] }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al modificar la cantidad del premio' });
    }
};

// LISTAR PREMIOS ACTIVOS (estado=true)  // FUNCIONA
exports.listarPremiosActivos = async (req, res) => {
    try {
        const premiosActivos = await obtenerPremiosActivos()
        return res.status(200).json(premiosActivos || {});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener la lista de premios activos' });
    }
}
