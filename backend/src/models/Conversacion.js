const mongoose = require('mongoose');

const conversacionSchema = new mongoose.Schema({
    sesion_id: String,
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