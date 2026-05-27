const axios = require('axios');
const Conversacion = require('../models/Conversacion');
require('dotenv').config();

const enviarMensaje = async (req, res) => {
    try {
        const { mensaje, historial = [], sesion_id } = req.body;

        // Llamar al chatbot IA
        const { data } = await axios.post(
            `${process.env.IA_URL}/chat/mensaje`,
            { mensaje, historial }
        );

        // Guardar conversación en MongoDB
        await Conversacion.findOneAndUpdate(
            { sesion_id },
            {
                $push: {
                    mensajes: [
                        { role: 'user', content: mensaje },
                        { role: 'assistant', content: data.respuesta }
                    ]
                },
                $set: { perfil_detectado: data.perfil_detectado }
            },
            { upsert: true, new: true }
        );

        res.json(data);
    } catch (err) {
        console.error('Error chat:', err.message);
        res.status(500).json({ error: 'Error al procesar el mensaje' });
    }
};

const obtenerHistorial = async (req, res) => {
    try {
        const { sesion_id } = req.params;
        const conversacion = await Conversacion.findOne({ sesion_id });
        res.json(conversacion || { mensajes: [] });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};

module.exports = { enviarMensaje, obtenerHistorial };