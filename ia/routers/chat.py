from fastapi import APIRouter
from models.schemas import MensajeChat, RespuestaChat
from services.rag import chat_con_orientatec

router = APIRouter(prefix="/chat", tags=["Chatbot OrientaTec"])

# Función normal (sin async): la llamada a Gemini es bloqueante y así FastAPI la
# ejecuta en un hilo aparte. Con "async def" cada conversación bloqueaba el
# servidor y los demás usuarios (chat y test) esperaban su turno.
@router.post("/mensaje", response_model=RespuestaChat)
def enviar_mensaje(data: MensajeChat):
    resultado = chat_con_orientatec(data.mensaje, data.historial, data.idioma)
    return RespuestaChat(
        respuesta=resultado["respuesta"],
        perfil_detectado=resultado.get("perfil_detectado")
    )

@router.get("/salud")
async def salud():
    return {"status": "OrientaTec IA activa ✅"}