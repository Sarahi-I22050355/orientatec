const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Prueba de conexión al arrancar. Se libera el cliente para devolverlo al pool
// (antes se quedaba apartado para siempre y el pool tenía una conexión menos).
pool.connect()
    .then(client => {
        client.release();
        console.log('✅ PostgreSQL conectado');
    })
    .catch(err => console.error('❌ Error PostgreSQL:', err.message));

// Evita que un error en una conexión inactiva tumbe el proceso.
pool.on('error', err => console.error('❌ Error PostgreSQL (pool):', err.message));

module.exports = pool;