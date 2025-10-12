//valida y y carga en el sheets

const googleSheets = require('../utils/googleHandler');

// GUARDAR MAIL EN GOOGLE SHEETS // FUNCIONA OKKKKKK
exports.guardarMail = async (req, res) => {

    
    const { nombre, apellido, email } = req.body;

    if (!nombre || !apellido || !email) {
        console.error('❌ Faltan datos:', { nombre, apellido, email });
        return res.status(400).json({ message: 'Faltan datos (nombre, apellido o email)' });
    }


    try {
        const ok = await googleSheets.guardarDatosEnSheets(nombre, apellido, email);

        console.log('📊 Resultado de guardarDatosEnSheets:', ok);

        if (!ok) {
            console.error('❌ guardarDatosEnSheets retornó false');
            return res.status(500).json({ message: 'Error al guardar datos en Google Sheets' });
        }

        console.log(`✅ ${nombre} ${apellido} guardado exitosamente`);
        res.status(201).json({ message: `${nombre} ${apellido} se cargó con éxito en la planilla` });
    } catch (error) {
        console.error('❌ Error en guardarMail:', error);
        res.status(500).json({ message: 'Error interno al guardar los datos' });
    }
};

exports.participarEnSorteo = async (req, res) => {
    try {
        const ultimo = await googleSheets.getUltimoEmail();

        if (!ultimo || !ultimo.email) {
            return res.status(400).json({ message: 'No hay jugador registrado.' });
        }

        const ok = await googleSheets.guardarParticipanteSorteo(
            ultimo.email,
            ultimo.nombre,
            ultimo.apellido,
            ultimo.fecha
        );

        if (ok) {
            return res.status(200).json({ message: 'Participación registrada correctamente.' });
        } else {
            return res.status(500).json({ message: 'Error al guardar participación.' });
        }
    } catch (e) {
        console.error('Error en participarEnSorteo:', e);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
