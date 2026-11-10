const axios = require('axios');
require('dotenv').config();

// Cliente HTTP para el servicio de IA con tiempo máximo de espera, para que una
// petición colgada no deje esperando al usuario (ni al servidor) para siempre.
const iaClient = axios.create({
    baseURL: process.env.IA_URL,
    timeout: Number(process.env.IA_TIMEOUT_MS) || 60000,
});

module.exports = iaClient;
