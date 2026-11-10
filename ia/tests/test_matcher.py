"""Pruebas del algoritmo del test vocacional.

Ejecutar desde la carpeta ia/:
    python -m unittest discover -s tests -v
"""
import re
import unittest
from pathlib import Path

from models.schemas import PerfilAspirante
from services.matcher import CARRERAS, calcular_match, _normalizar

# Opciones exactas del select "¿Dónde te ves trabajando?" del frontend
# (frontend/src/pages/TestVocacional.jsx) y carreras que deben recibir el bonus.
OPCIONES_ENTORNO = {
    "Planta industrial y talleres especializados": {"ING_INDUSTRIAL", "ING_ELECTRONICA", "ING_MECANICA", "ING_MECATRONICA"},
    "Oficina o empresa de tecnología": {"ING_INFORMATICA", "ING_GESTION"},
    "Laboratorio de investigación": {"ING_ELECTRONICA"},
    "Mi propia empresa": {"ING_GESTION"},
    "Trabajo remoto desde casa": {"ING_INFORMATICA"},
    "Campo y exteriores (parques solares o eólicos)": {"ING_ENERGIAS"},
}


def carreras_con_bonus(opcion: str) -> set[str]:
    entorno = _normalizar(opcion)
    return {cid for cid, c in CARRERAS.items()
            if any(_normalizar(e) in entorno for e in c["entornos"])}


def perfil(**extra) -> PerfilAspirante:
    base = dict(
        bachillerato_origen="CBTiS Núm. 36", municipio="Monclova",
        materias_favoritas=[], pasatiempos=[],
        habilidad_logica=50, habilidad_diseno=50,
        habilidad_liderazgo=50, habilidad_manual=50,
        entorno_laboral="", prioridad_profesional="",
    )
    base.update(extra)
    return PerfilAspirante(**base)


class TestBonusEntorno(unittest.TestCase):
    def test_cada_opcion_da_bonus_a_las_carreras_esperadas(self):
        for opcion, esperadas in OPCIONES_ENTORNO.items():
            with self.subTest(opcion=opcion):
                self.assertEqual(carreras_con_bonus(opcion), esperadas)

    def test_opciones_coinciden_con_el_frontend(self):
        jsx = Path(__file__).resolve().parents[2] / "frontend/src/pages/TestVocacional.jsx"
        if not jsx.exists():
            self.skipTest("frontend no disponible")
        bloque = re.search(r"\{\[('Planta industrial[^\]]*)\]\.map", jsx.read_text(encoding="utf-8"))
        opciones = re.findall(r"'([^']+)'", bloque.group(1))
        self.assertEqual(opciones, list(OPCIONES_ENTORNO))

    def test_todas_las_carreras_pueden_recibir_el_bonus(self):
        alcanzables = set().union(*OPCIONES_ENTORNO.values())
        self.assertEqual(alcanzables, set(CARRERAS))

    def test_energias_recibe_10_puntos_con_su_entorno(self):
        sin = {r.carrera_id: r.porcentaje_match for r in calcular_match(perfil(
            pasatiempos=["Cuidar el ambiente"], entorno_laboral="Mi propia empresa"))}
        con = {r.carrera_id: r.porcentaje_match for r in calcular_match(perfil(
            pasatiempos=["Cuidar el ambiente"],
            entorno_laboral="Campo y exteriores (parques solares o eólicos)"))}
        self.assertAlmostEqual(con["ING_ENERGIAS"] - sin["ING_ENERGIAS"], 10.0, places=1)

    def test_comparacion_sin_acentos_ni_mayusculas(self):
        self.assertEqual(_normalizar("Oficina o empresa de TECNOLOGÍA"),
                         "oficina o empresa de tecnologia")
        self.assertEqual(_normalizar(None), "")


class TestCalcularMatch(unittest.TestCase):
    def test_devuelve_top_3_ordenado(self):
        res = calcular_match(perfil(entorno_laboral="Trabajo remoto desde casa"))
        self.assertEqual(len(res), 3)
        puntajes = [r.porcentaje_match for r in res]
        self.assertEqual(puntajes, sorted(puntajes, reverse=True))
        self.assertTrue(all(0 <= p <= 100 for p in puntajes))

    def test_programador_obtiene_informatica(self):
        res = calcular_match(perfil(
            materias_favoritas=["Programación", "Matemáticas"], pasatiempos=["Programar"],
            habilidad_logica=90, habilidad_diseno=70, habilidad_liderazgo=40, habilidad_manual=30,
            entorno_laboral="Trabajo remoto desde casa"))
        self.assertEqual(res[0].carrera_id, "ING_INFORMATICA")
        self.assertEqual(res[0].porcentaje_match, 77.9)

    def test_perfil_mecatronico_obtiene_mecatronica(self):
        res = calcular_match(perfil(
            materias_favoritas=["Física", "Programación"],
            pasatiempos=["Armar circuitos", "Diseñar piezas"],
            habilidad_logica=90, habilidad_diseno=75, habilidad_liderazgo=50, habilidad_manual=85,
            entorno_laboral="Planta industrial y talleres especializados",
            texto_libre="Me gustaria construir un robot y programar un PLC"))
        self.assertEqual(res[0].carrera_id, "ING_MECATRONICA")
        self.assertEqual(res[0].nombre_carrera, "Ingeniería Mecatrónica")


if __name__ == "__main__":
    unittest.main()
