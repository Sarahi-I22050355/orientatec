from pydantic import BaseModel
from typing import Optional

# ─── ENTRADA DEL ASPIRANTE ───────────────────────────────────────────────────

class PerfilAspirante(BaseModel):
    nombre: str
    bachillerato_origen: str  # CBTis, COBAC, Privado, etc.
    municipio: str
    materias_favoritas: list[str]
    pasatiempos: list[str]
    habilidad_logica: int        # 0-100
    habilidad_diseno: int        # 0-100
    habilidad_liderazgo: int     # 0-100
    habilidad_manual: int        # 0-100
    entorno_laboral: str
    prioridad_profesional: str
    texto_libre: Optional[str] = None  # Respuesta abierta del chatbot

# ─── RESULTADO DEL MATCH VOCACIONAL ──────────────────────────────────────────

class ResultadoCarrera(BaseModel):
    carrera_id: str
    nombre_carrera: str
    porcentaje_match: float
    razonamiento: str

class RespuestaMatch(BaseModel):
    aspirante: str
    perfil_detectado: str
    prediccion: list[ResultadoCarrera]
    proxima_accion: str

# ─── CHATBOT ─────────────────────────────────────────────────────────────────

class MensajeChat(BaseModel):
    mensaje: str
    historial: Optional[list[dict]] = []

class RespuestaChat(BaseModel):
    respuesta: str
    perfil_detectado: Optional[str] = None