const mongoose = require('mongoose');

const conversacionSchema = new mongoose.Schema({
    // Índice: cada mensaje del chat busca la conversación por sesion_id.
    sesion_id: { type: String, index: true },
    mensajes: [
        {
            role: { type: String, enum: ['user', 'assistant'] },
            content: String,
            timestamp: { type: Date, default: Date.now }
        }
    ],
    perfil_detectado: String,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversacion', conversacionSchema);