const express = require('express');
const router = express.Router();
const { matchVocacional, listarCarreras } = require('../controllers/vocacionalController');

router.post('/match', matchVocacional);
router.get('/carreras', listarCarreras);

module.exports = router;