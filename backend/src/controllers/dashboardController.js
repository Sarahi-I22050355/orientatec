const { obtenerEstadisticas } = require('../models/Aspirante');
const Conversacion = require('../models/Conversacion');
const mongoose = require('mongoose');

const getEstadisticas = async (req, res) => {
    let carreras = [];
    let municipios = [];
    let totalChats = 0;

    try {
        const resultado = await obtenerEstadisticas();
        carreras = resultado.carreras;
        municipios = resultado.municipios;
    } catch (pgErr) {
        console.warn('PostgreSQL no disponible:', pgErr.message);
    }

    try {
        if (mongoose.connection.readyState === 1) {
            totalChats = await Conversacion.countDocuments();
        }
    } catch (mongoErr) {
        console.warn('MongoDB no disponible:', mongoErr.message);
    }

    res.json({
        carreras,
        municipios,
        total_chats: totalChats,
        actualizado: new Date()
    });
};

module.exports = { getEstadisticas };
