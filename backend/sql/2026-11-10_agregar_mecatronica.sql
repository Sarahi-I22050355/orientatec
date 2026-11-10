-- ============================================================================
-- OrientaTec — Alta de Ingeniería Mecatrónica en PostgreSQL
-- Fecha: 2026-11-10
--
-- IMPORTANTE: la base de datos NO tiene una tabla de catálogo de carreras.
-- La lista de carreras vive en ia/services/matcher.py y la tabla "aspirantes"
-- solo guarda el NOMBRE de la carrera como texto (carrera_match1..3) y el
-- "perfil_detectado". Por eso agregar Mecatrónica NO requiere cambiar el
-- esquema: en cuanto se despliega el servicio de IA, los nuevos tests ya
-- guardan "Ingeniería Mecatrónica" y el dashboard la cuenta.
--
-- Este script solo VERIFICA que todo esté listo. Es de solo lectura y se
-- puede correr las veces que quieras.
--
-- Cómo ejecutarlo en el servidor (PostgreSQL en Docker):
--   docker exec -i <contenedor_postgres> psql -U orientatec -d orientatec \
--     < backend/sql/2026-11-10_agregar_mecatronica.sql
-- ============================================================================

-- 1) La tabla existe y las columnas de texto alcanzan para los nombres nuevos.
--    "Ingeniería Mecatrónica" = 22 caracteres y "Perfil mecatrónico-robótica"
--    = 27 caracteres; las columnas son VARCHAR(100).
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'aspirantes'
  AND column_name IN ('perfil_detectado', 'carrera_match1', 'carrera_match2', 'carrera_match3')
ORDER BY column_name;

-- 2) Codificación de la base: debe ser UTF8 para guardar acentos (í, ó).
SELECT datname, pg_encoding_to_char(encoding) AS codificacion
FROM pg_database
WHERE datname = current_database();

-- 3) Nombres de carrera que hay hoy en la tabla (antes del despliegue solo
--    deben aparecer las 6 carreras originales).
SELECT carrera_match1 AS carrera, COUNT(*) AS total
FROM aspirantes
WHERE carrera_match1 IS NOT NULL
GROUP BY carrera_match1
ORDER BY total DESC;

-- 4) Después de desplegar y hacer un test de prueba, esta consulta debe
--    devolver al menos una fila con Mecatrónica.
SELECT id, nombre, perfil_detectado,
       carrera_match1, porcentaje_match1,
       carrera_match2, porcentaje_match2,
       carrera_match3, porcentaje_match3,
       fecha
FROM aspirantes
WHERE 'Ingeniería Mecatrónica' IN (carrera_match1, carrera_match2, carrera_match3)
ORDER BY fecha DESC
LIMIT 10;
