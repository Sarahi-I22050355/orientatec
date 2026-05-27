const express = require('express');
const router = express.Router();
const { getEstadisticas } = require('../controllers/dashboardController');

router.get('/estadisticas', getEstadisticas);

module.exports = router;