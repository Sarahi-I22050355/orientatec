"""Pruebas del idioma de respuesta del chatbot.

Ejecutar desde la carpeta ia/:
    python -m unittest discover -s tests -v
"""
import unittest
from unittest.mock import MagicMock, patch

from services import rag
from services.rag import detectar_idioma

SUGERENCIAS_ES = [
    "¿Qué carreras tienen?",
    "¿Hay becas disponibles?",
    "¿Dónde está el campus?",
    "¿Qué actividades extracurriculares hay?",
]
SUGERENCIAS_EN = [
    "What degrees do you offer?",
    "Are there scholarships available?",
    "Where is the campus?",
    "What extracurricular activities are there?",
]


class TestDetectarIdioma(unittest.TestCase):
    def test_sugerencias_en_espanol(self):
        for texto in SUGERENCIAS_ES:
            # Aunque el sitio esté en inglés, si escriben en español se responde en español.
            self.assertEqual(detectar_idioma(texto, "en"), "es", texto)

    def test_sugerencias_en_ingles(self):
        for texto in SUGERENCIAS_EN:
            # Aunque el sitio esté en español, si escriben en inglés se responde en inglés.
            self.assertEqual(detectar_idioma(texto, "es"), "en", texto)

    def test_mensajes_libres(self):
        self.assertEqual(detectar_idioma("me gusta programar", "en"), "es")
        self.assertEqual(detectar_idioma("I like robots", "es"), "en")

    def test_ambiguo_usa_idioma_del_sitio(self):
        self.assertEqual(detectar_idioma("ok", "en"), "en")
        self.assertEqual(detectar_idioma("ok", "es"), "es")
        self.assertEqual(detectar_idioma("ok", "fr"), "es")


class TestInstruccionDeIdioma(unittest.TestCase):
    def _prompt_enviado(self, mensaje, idioma):
        respuesta = MagicMock()
        respuesta.json.return_value = {"candidates": [{"content": {"parts": [{"text": "ok"}]}}]}
        with patch.object(rag.requests, "post", return_value=respuesta) as post:
            rag.chat_con_orientatec(mensaje, [], idioma)
        return post.call_args.kwargs["json"]["system_instruction"]["parts"][0]["text"]

    def test_pregunta_en_ingles_pide_respuesta_en_ingles(self):
        for texto in SUGERENCIAS_EN:
            prompt = self._prompt_enviado(texto, "en")
            self.assertIn("está en inglés (English)", prompt, texto)

    def test_pregunta_en_espanol_pide_respuesta_en_espanol(self):
        for texto in SUGERENCIAS_ES:
            prompt = self._prompt_enviado(texto, "en")
            self.assertIn("está en español", prompt, texto)


if __name__ == "__main__":
    unittest.main()
