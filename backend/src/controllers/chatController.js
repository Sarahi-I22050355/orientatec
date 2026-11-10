const iaClient = require('../config/ia');
const Conversacion = require('../models/Conversacion');

const MAX_MENSAJE = 4000;

const enviarMensaje = async (req, res) => {
    const { mensaje, historial = [], sesion_id } = req.body || {};

    // Validación de entrada. sesion_id debe ser texto: si llegara un objeto
    // (por ejemplo {"$ne": null}) MongoDB lo interpretaría como un operador
    // y se podría escribir en la conversación de otra persona.
    if (typeof mensaje !== 'string' || !mensaje.trim() || mensaje.length > MAX_MENSAJE) {
        return res.status(400).json({ error: 'Mensaje inválido' });
    }
    if (!Array.isArray(historial)) {
        return res.status(400).json({ error: 'Historial inválido' });
    }
    if (sesion_id !== undefined && (typeof sesion_id !== 'string' || sesion_id.length > 100)) {
        return res.status(400).json({ error: 'Sesión inválida' });
    }

    let data;
    try {
        // Llamar al chatbot IA
        ({ data } = await iaClient.post('/chat/mensaje', { mensaje, historial }));
    } catch (err) {
        console.error('Error chat:', err.message);
        if (err.response?.status === 422) {
            return res.status(400).json({ error: 'Datos del mensaje inválidos' });
        }
        return res.status(500).json({ error: 'Error al procesar el mensaje' });
    }

    // Guardar conversación en MongoDB. Si falla, igual se entrega la respuesta
    // al usuario (antes se perdía la respuesta de la IA y se mostraba un error).
    if (sesion_id) {
        try {
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
                { upsert: true }
            );
        } catch (err) {
            console.error('Error guardando conversación:', err.message);
        }
    }

    res.json(data);
};

const obtenerHistorial = async (req, res) => {
    try {
        const { sesion_id } = req.params;
        const conversacion = await Conversacion.findOne({ sesion_id }).lean();
        res.json(conversacion || { mensajes: [] });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};

module.exports = { enviarMensaje, obtenerHistorial };
