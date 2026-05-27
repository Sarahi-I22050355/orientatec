const axios = require('axios');
const { guardarAspirante } = require('../models/Aspirante');
require('dotenv').config();

const matchVocacional = async (req, res) => {
    try {
        // Llamar al módulo de IA
        const { data } = await axios.post(
            `${process.env.IA_URL}/vocacional/match`,
            req.body
        );

        // Guardar resultado en PostgreSQL
        await guardarAspirante({
            nombre: req.body.nombre,
            bachillerato: req.body.bachillerato_origen,
            municipio: req.body.municipio,
            perfil_detectado: data.perfil_detectado,
            prediccion: data.prediccion
        });

        res.json(data);
    } catch (err) {
        console.error('Error match vocacional:', err.message);
        res.status(500).json({ error: 'Error al procesar el match vocacional' });
    }
};

const listarCarreras = async (req, res) => {
    try {
        const { data } = await axios.get(`${process.env.IA_URL}/vocacional/carreras`);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener carreras' });
    }
};

module.exports = { matchVocacional, listarCarreras };