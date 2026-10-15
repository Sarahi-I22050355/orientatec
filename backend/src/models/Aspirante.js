const pool = require('../config/db');

// Crear tabla si no existe
const crearTabla = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS aspirantes (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100),
            bachillerato VARCHAR(100),
            municipio VARCHAR(100),
            perfil_detectado VARCHAR(100),
            carrera_match1 VARCHAR(100),
            porcentaje_match1 FLOAT,
            carrera_match2 VARCHAR(100),
            porcentaje_match2 FLOAT,
            carrera_match3 VARCHAR(100),
            porcentaje_match3 FLOAT,
            fecha TIMESTAMP DEFAULT NOW()
        )
    `);
    console.log('✅ Tabla aspirantes lista');
};

const guardarAspirante = async (datos) => {
    const { rows } = await pool.query(
        `INSERT INTO aspirantes 
        (nombre, bachillerato, municipio, perfil_detectado, 
         carrera_match1, porcentaje_match1,
         carrera_match2, porcentaje_match2,
         carrera_match3, porcentaje_match3)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`,
        [
            datos.nombre,
            datos.bachillerato,
            datos.municipio,
            datos.perfil_detectado,
            datos.prediccion[0]?.nombre_carrera,
            datos.prediccion[0]?.porcentaje_match,
            datos.prediccion[1]?.nombre_carrera,
            datos.prediccion[1]?.porcentaje_match,
            datos.prediccion[2]?.nombre_carrera,
            datos.prediccion[2]?.porcentaje_match,
        ]
    );
    return rows[0];
};

const obtenerEstadisticas = async () => {
    const { rows } = await pool.query(
        'SELECT carrera_match1 as carrera, COUNT(*) as total, ROUND(AVG(porcentaje_match1)::numeric, 1) as promedio_match FROM aspirantes WHERE carrera_match1 IS NOT NULL GROUP BY carrera_match1 ORDER BY total DESC'
    );

    const { rows: municipios } = await pool.query(
        'SELECT LOWER(TRIM(municipio)) as municipio, COUNT(*) as total FROM aspirantes WHERE municipio IS NOT NULL AND municipio != \'\' GROUP BY LOWER(TRIM(municipio)) ORDER BY total DESC'
    );

    return { carreras: rows, municipios };
};

module.exports = { crearTabla, guardarAspirante, obtenerEstadisticas };
