from pydantic import BaseModel, Field
from typing import Literal, Optional

# ─── ENTRADA DEL ASPIRANTE ───────────────────────────────────────────────────

class PerfilAspirante(BaseModel):
    # Límites de longitud = tamaño de las columnas VARCHAR(100) en PostgreSQL.
    nombre: str = Field('Anónimo', max_length=100)
    bachillerato_origen: str = Field(max_length=100)  # CBTis, COBAC, Privado, etc.
    municipio: str = Field(max_length=100)
    materias_favoritas: list[str] = Field(max_length=20)
    pasatiempos: list[str] = Field(max_length=20)
    habilidad_logica: int = Field(ge=0, le=100)
    habilidad_diseno: int = Field(ge=0, le=100)
    habilidad_liderazgo: int = Field(ge=0, le=100)
    habilidad_manual: int = Field(ge=0, le=100)
    entorno_laboral: str = Field(max_length=200)
    prioridad_profesional: str = Field(max_length=200)
    texto_libre: Optional[str] = Field(None, max_length=3000)  # Respuesta abierta

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
    mensaje: str = Field(min_length=1, max_length=4000)
    historial: Optional[list[dict]] = []
    # Idioma seleccionado en el sitio. Solo se usa si no se puede saber el
    # idioma del mensaje; el bot responde en el idioma en que le escriben.
    idioma: Literal['es', 'en'] = 'es'

class RespuestaChat(BaseModel):
    respuesta: str
    perfil_detectado: Optional[str] = None