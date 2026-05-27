const express = require('express');
const router = express.Router();
const { enviarMensaje, obtenerHistorial } = require('../controllers/chatController');

router.post('/mensaje', enviarMensaje);
router.get('/historial/:sesion_id', obtenerHistorial);

module.exports = router;