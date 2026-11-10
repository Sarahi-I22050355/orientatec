const express = require('express');
const cors = require('cors');
require('dotenv').config();

const conectarMongo = require('./config/mongo');
const { crearTabla } = require('./models/Aspirante');

const vocacionalRoutes = require('./routes/vocacional');
const chatRoutes = require('./routes/chat');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// No anunciar que el servidor usa Express.
app.disable('x-powered-by');

// CORS: si CORS_ORIGIN está definido (lista separada por comas) solo esos
// orígenes pueden llamar a la API desde el navegador; si no, se permite
// cualquiera (comportamiento original).
const origenesPermitidos = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
app.use(cors(origenesPermitidos.length ? { origin: origenesPermitidos } : undefined));

// Cabeceras de seguridad básicas para respuestas JSON de la API.
app.use((req, res, next) => {
    res.set({
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    next();
});

// Registrar peticiones lentas (> 3 s) para detectar cuellos de botella.
app.use((req, res, next) => {
    const inicio = process.hrtime.bigint();
    res.on('finish', () => {
        const ms = Number(process.hrtime.bigint() - inicio) / 1e6;
        if (ms > 3000) {
            console.warn(`🐢 Petición lenta: ${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(0)} ms`);
        }
    });
    next();
});

app.use(express.json({ limit: '100kb' }));

app.use('/api/vocacional', vocacionalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'OrientaTec Backend corriendo ✅' });
});

app.use((err, req, res, next) => {
    // JSON mal formado o demasiado grande: es un error del cliente, no del servidor.
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido' });
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'La petición es demasiado grande' });
    }
    console.error('Error no manejado:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const iniciar = async () => {
    // MongoDB se conecta en segundo plano (con reintentos). Antes el servidor no
    // empezaba a escuchar hasta que Mongo respondiera, así que una caída de Mongo
    // también tumbaba el test vocacional y el dashboard, que usan PostgreSQL.
    conectarMongo();

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