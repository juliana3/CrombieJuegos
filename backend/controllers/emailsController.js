//valida y y carga en el sheets

const googleSheets = require('../utils/googleHandler');

// GUARDAR MAIL EN GOOGLE SHEETS // FUNCIONA OKKKKKK
exports.guardarMail = async (req, res) => {
    const { nombre, apellido, email } = req.body;

    if (!nombre || !apellido || !email) {
        return res.status(400).json({ message: 'Faltan datos (nombre, apellido o email)' });
    }

    try {
        const ok = await googleSheets.guardarDatosEnSheets(nombre, apellido, email);

        if (!ok) {
            return res.status(500).json({ message: 'Error al guardar datos en Google Sheets' });
        }

        res.status(201).json({ message: 'Datos guardados correctamente en Google Sheets' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno al guardar los datos' });
    }
};
