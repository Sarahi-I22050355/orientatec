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

app.use('/api/vocacional', vocacionalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'OrientaTec Backend corriendo ✅' });
});

app.use((err, req, res, next) => {
    console.error('Error no manejado:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const iniciar = async () => {
    await conectarMongo();

    try {
        await crearTabla();
        console.log('✅ Tabla aspirantes lista');
    } catch (err) {
        console.warn('⚠️ No se pudo crear la tabla (puede que ya exista):', err.message);
    }

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
    });
};

iniciar();