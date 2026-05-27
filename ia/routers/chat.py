from fastapi import APIRouter
from models.schemas import MensajeChat, RespuestaChat
from services.rag import chat_con_orientatec

router = APIRouter(prefix="/chat", tags=["Chatbot OrientaTec"])

@router.post("/mensaje", response_model=RespuestaChat)
async def enviar_mensaje(data: MensajeChat):
    resultado = chat_con_orientatec(data.mensaje, data.historial)
    return RespuestaChat(
        respuesta=resultado["respuesta"],
        perfil_detectado=resultado.get("perfil_detectado")
    )

@router.get("/salud")
async def salud():
    return {"status": "OrientaTec IA activa ✅"}