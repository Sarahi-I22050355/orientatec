from fastapi import APIRouter
from models.schemas import PerfilAspirante, RespuestaMatch
from services.matcher import calcular_match, detectar_perfil, CARRERAS

router = APIRouter(prefix="/vocacional", tags=["Match Vocacional"])

@router.post("/match", response_model=RespuestaMatch)
async def match_vocacional(perfil: PerfilAspirante):
    resultados = calcular_match(perfil)
    perfil_detectado = detectar_perfil(resultados)
    top_carrera = resultados[0]
    carrera_info = CARRERAS[top_carrera.carrera_id]

    return RespuestaMatch(
        aspirante=perfil.nombre,
        perfil_detectado=perfil_detectado,
        prediccion=resultados,
        proxima_accion=carrera_info["accion"]
    )

@router.get("/carreras")
async def listar_carreras():
    return [
        {"id": cid, "nombre": c["nombre"]}
        for cid, c in CARRERAS.items()
    ]