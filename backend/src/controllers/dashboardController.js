const { obtenerEstadisticas } = require('../models/Aspirante');
const Conversacion = require('../models/Conversacion');

const getEstadisticas = async (req, res) => {
    let carreras = [];
    let municipios = [];
    let totalChats = 0;

    // PostgreSQL y MongoDB se consultan en paralelo; si uno falla, el otro
    // se muestra igual (mismo comportamiento que antes, pero más rápido).
    const [pg, mongo] = await Promise.allSettled([
        obtenerEstadisticas(),
        Conversacion.estimatedDocumentCount(),
    ]);

    if (pg.status === 'fulfilled') {
        carreras = pg.value.carreras;
        municipios = pg.value.municipios;
    } else {
        console.warn('PostgreSQL no disponible:', pg.reason?.message);
    }

    if (mongo.status === 'fulfilled') {
        totalChats = mongo.value;
    } else {
        console.warn('MongoDB no disponible:', mongo.reason?.message);
    }

    res.json({
        carreras,
        municipios,
        total_chats: totalChats,
        actualizado: new Date()
    });
};

module.exports = { getEstadisticas };
