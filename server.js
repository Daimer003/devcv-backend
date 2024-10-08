const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cvRoutes = require('./src/routes/cvRoutes');
const connectDB = require('./src/config/db');
const path = require('path');

dotenv.config();
const app = express()

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

// Rutas
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de DevCV Pro')
})

app.use('/api/cv', cvRoutes);
app.use('/files', express.static(path.join(__dirname, 'files')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
 });
