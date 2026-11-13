"""Pruebas de las respuestas amables del chatbot.

- Si Gemini falla (sin conexión, tiempo agotado, respuesta vacía o bloqueada),
  el bot contesta con un mensaje de respaldo en vez de lanzar un error.
- El prompt incluye cómo responder preguntas sobre maestros.

Ejecutar desde la carpeta ia/:
    python -m unittest discover -s tests -v
"""
import unittest
from unittest.mock import MagicMock, patch

import requests

from services import rag


def _respuesta(json_data):
    r = MagicMock()
    r.json.return_value = json_data
    return r


class TestRespuestaDeRespaldo(unittest.TestCase):
    def _chat(self, mensaje, idioma="es", **post_kwargs):
        with patch.object(rag.requests, "post", **post_kwargs):
            return rag.chat_con_orientatec(mensaje, [], idioma)

    def test_sin_conexion_responde_amable_en_espanol(self):
        r = self._chat("¿Cuál maestro es el mejor?",
                       side_effect=requests.ConnectionError("sin red"))
        self.assertEqual(r["respuesta"], rag.RESPUESTA_RESPALDO["es"])
        self.assertIsNone(r["perfil_detectado"])

    def test_tiempo_agotado_responde_amable_en_ingles(self):
        r = self._chat("Who is the best teacher?", "es",
                       side_effect=requests.Timeout("lento"))
        self.assertEqual(r["respuesta"], rag.RESPUESTA_RESPALDO["en"])

    def test_error_http_de_gemini(self):
        mala = _respuesta({})
        mala.raise_for_status.side_effect = requests.HTTPError("429 cuota")
        r = self._chat("¿Hay becas?", return_value=mala)
        self.assertEqual(r["respuesta"], rag.RESPUESTA_RESPALDO["es"])

    def test_respuesta_bloqueada_sin_candidatos(self):
        r = self._chat("¿Qué maestro es el peor?",
                       return_value=_respuesta({"promptFeedback": {"blockReason": "OTHER"}}))
        self.assertEqual(r["respuesta"], rag.RESPUESTA_RESPALDO["es"])

    def test_respuesta_vacia(self):
        r = self._chat("¿Qué maestro es el mejor?",
                       return_value=_respuesta({"candidates": [{"content": {"parts": [{"text": "  "}]}}]}))
        self.assertEqual(r["respuesta"], rag.RESPUESTA_RESPALDO["es"])

    def test_candidato_sin_contenido(self):
        # Pasa cuando Gemini corta la respuesta por seguridad (finishReason SAFETY).
        r = self._chat("¿Qué maestro es el mejor?",
                       return_value=_respuesta({"candidates": [{"finishReason": "SAFETY"}]}))
        self.assertEqual(r["respuesta"], rag.RESPUESTA_RESPALDO["es"])

    def test_respuesta_normal_no_cambia(self):
        r = self._chat("me gusta programar software",
                       return_value=_respuesta({"candidates": [{"content": {"parts": [{"text": "¡Genial!"}]}}]}))
        self.assertEqual(r["respuesta"], "¡Genial!")
        self.assertEqual(r["perfil_detectado"], "Informática / Sistemas")


class TestPromptMaestros(unittest.TestCase):
    def test_prompt_explica_como_responder_sobre_maestros(self):
        prompt = rag.CONOCIMIENTO_ITSM
        self.assertIn("=== MAESTROS Y DOCENTES ===", prompt)
        self.assertIn("NUNCA inventes nombres de maestros", prompt)
        self.assertIn("19. Si te preguntan algo del TecNM Campus Monclova que NO está", prompt)


if __name__ == "__main__":
    unittest.main()
