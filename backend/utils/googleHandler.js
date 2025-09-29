//GOOGLEHANDLER.JS --> Manejo de Google Drive y Google Sheets
const { google } = require('googleapis');
const path = require('path');
const dotenv = require('dotenv');
const stream = require('stream');

dotenv.config();

// Carga de credenciales y variables de entorno
// La ruta ahora se construye dinámicamente usando la variable de entorno SERVICE_ACCOUNT_FILE
const SERVICE_ACCOUNT_FILE = path.join(__dirname, '..', 'juego-mkt-4d9468404a43.json');
const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];
const SHEETS_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// IDs de carpetas y hojas de cálculo. Ahora se obtienen de las variables de entorno.
const ID_CARPETA_FOTOS_PREMIOS = process.env.ID_CARPETA_FOTOS_PREMIOS;
const ID_HOJA_SHEETS_MAILS = process.env.ID_HOJA_SHEETS_MAILS;



// --- Funciones para Google Drive ---

// Función para obtener el servicio de Google Drive
const getDriveService = async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: SERVICE_ACCOUNT_FILE,
            scopes: DRIVE_SCOPES,
        });
        const drive = google.drive({ version: 'v3', auth });
        return drive;
    } catch (e) {
        log.error(`Error al obtener el servicio de Google Drive:`, e);
        return null;
    }
};

// Función para subir una imagen a Google Drive desde un buffer
const subirImagenADrive = async (imageBuffer, nombreArchivo) => {
    const driveService = await getDriveService();
    if (!driveService) return null;

    try {
        const fileMetadata = {
            name: nombreArchivo,
            parents: [ID_CARPETA_FOTOS_PREMIOS], // Usamos la variable de entorno
        };

        const bufferStream = new stream.Readable();
        bufferStream.push(imageBuffer);
        bufferStream.push(null);

        const media = {
            mimeType: 'image/jpeg',
            body: bufferStream,
        };

        const uploadedFile = await driveService.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
            supportsAllDrives: true,
        });

        const fileId = uploadedFile.data.id;
        console.log(`Archivo ${nombreArchivo} subido correctamente a Google Drive con ID: ${fileId}`);
        return fileId;
    } catch (e) {
        console.error(`Error al subir el archivo a Drive:`, e);
        return null;
    }
};


// --- Funciones para Google Sheets ---

// Función para obtener el servicio de Google Sheets
const getSheetsService = async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: SERVICE_ACCOUNT_FILE,
            scopes: SHEETS_SCOPES,
        });
        const sheets = google.sheets({ version: 'v4', auth });
        return sheets;
    } catch (e) {
        log.error(`Error al obtener el servicio de Google Sheets:`, e);
        return null;
    }
};

// Función para guardar datos en Google Sheets
const guardarDatosEnSheets = async (nombre, apellido, email) => {
    const sheetsService = await getSheetsService();
    if (!sheetsService) return false;

    // Obtener la fecha actual en formato 'dd/mm/yyyy'
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const values = [
        [
            formattedDate, // Fecha en la primera columna
            nombre,
            apellido,
            email,
        ],
    ];

    const resource = {
        values,
    };

    try {
        await sheetsService.spreadsheets.values.append({
            spreadsheetId: ID_HOJA_SHEETS_MAILS,
            range: 'eventos!A1', // Escribe en la primera fila disponible de la hoja
            valueInputOption: 'USER_ENTERED',
            resource,
        });
        console.log(`Datos del usuario ${nombre} ${apellido} guardados en Google Sheets.`);
        return true;
    } catch (e) {
        console.log(`Error al guardar los datos en Google Sheets:`, e);
        console.error(`Error al guardar los datos en Google Sheets:`, e);
        return false;
    }
};



// Exportamos las funciones que serán utilizadas por otros módulos
module.exports = {
    getDriveService,
    subirImagenADrive,
    guardarDatosEnSheets,
};