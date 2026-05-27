const express = require('express');
const cors = require('cors');
require('dotenv').config();

const conectarMongo = require('./config/mongo');
const { crearTabla } = require('./models/Aspirante');

const vocacionalRoutes = require('./routes/vocacional');
const chatRoutes = require('./routes/chat');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/vocacional', vocacionalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'OrientaTec Backend corriendo ✅' });
});

// Inicializar conexiones y servidor
const iniciar = async () => {
    await conectarMongo();
    await crearTabla();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    });
};

iniciar();