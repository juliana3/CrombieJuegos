//const app = require('./app');

//app.listen(3000,() => console.log('Server on port 3000'));

//arranca el servidor
const express = require('express');
const cors = require('cors');
const app = express();

// Usar el middleware de CORS
app.use(cors());

// Definir la ruta de la API
app.get('/api/data', (req, res) => {
  // Envía tu archivo JSON aquí
  const data = require('./data/data.json'); // o el método para obtenerlo de la DB
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});