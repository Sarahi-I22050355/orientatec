const { obtenerEstadisticas } = require('../models/Aspirante');
const Conversacion = require('../models/Conversacion');

const getEstadisticas = async (req, res) => {
    try {
        const [estadisticas, totalChats] = await Promise.all([
            obtenerEstadisticas(),
            Conversacion.countDocuments()
        ]);

        res.json({
            carreras: estadisticas,
            total_chats: totalChats,
            actualizado: new Date()
        });
    } catch (err) {
        console.error('Error dashboard:', err.message);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

module.exports = { getEstadisticas };