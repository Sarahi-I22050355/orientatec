const iaClient = require('../config/ia');
const { guardarAspirante } = require('../models/Aspirante');

const matchVocacional = async (req, res) => {
    const body = req.body || {};

    let data;
    try {
        // Llamar al módulo de IA (valida los datos del formulario)
        ({ data } = await iaClient.post('/vocacional/match', body));
    } catch (err) {
        console.error('Error match vocacional:', err.message);
        if (err.response?.status === 422) {
            return res.status(400).json({ error: 'Datos del test inválidos' });
        }
        return res.status(500).json({ error: 'Error al procesar el match vocacional' });
    }

    // Guardar resultado en PostgreSQL. Si falla, igual se muestra el resultado
    // al aspirante (antes perdía su test y veía un error).
    try {
        await guardarAspirante({
            nombre: body.nombre || 'Anónimo',
            bachillerato: body.bachillerato_origen,
            municipio: body.municipio,
            perfil_detectado: data.perfil_detectado,
            prediccion: data.prediccion
        });
    } catch (err) {
        console.error('Error guardando aspirante:', err.message);
    }

    res.json(data);
};

const listarCarreras = async (req, res) => {
    try {
        const { data } = await iaClient.get('/vocacional/carreras');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener carreras' });
    }
};

module.exports = { matchVocacional, listarCarreras };
