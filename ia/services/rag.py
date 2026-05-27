from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv
import os

load_dotenv()

CONOCIMIENTO_ITSM = """
Eres OrientaTec, el asistente virtual del TecNM Campus Monclova (ITSM).
Tu misión es orientar a estudiantes de bachillerato sobre las carreras disponibles
y ayudarles a descubrir cuál es la más adecuada para su perfil.

CARRERAS DISPONIBLES:
1. Ingeniería en Informática: Programación, software, bases de datos, redes, ciberseguridad.
2. Ingeniería Industrial: Manufactura esbelta, optimización de procesos, calidad, logística.
3. Ingeniería en Electrónica: Circuitos, instrumentación, telecomunicaciones, automatización.
4. Ingeniería en Mecánica: CAD/CAM, termodinámica, mantenimiento, metalurgia.
5. Ingeniería en Energías Renovables: Solar fotovoltaica, eólica, auditorías energéticas.
6. Ingeniería en Gestión Empresarial: Finanzas, marketing, planes de negocio, capital humano.

CONTEXTO REGIONAL:
- Monclova es el centro siderúrgico más importante del norte de México (AHMSA).
- Alta demanda de ingenieros en electrónica, mecánica e industrial en la región.
- El campus tiene laboratorios de robótica, CAD/CAM y energía solar.
- Bolsa de trabajo con más de 200 empresas de la región.

INSTRUCCIONES:
- Habla de forma amigable, como un amigo que sabe mucho.
- Haz preguntas para conocer mejor al estudiante.
- Nunca inventes información sobre el campus.
- Sugiere que haga el test vocacional cuando tengas suficiente información del estudiante.
- Responde siempre en español.
"""

def get_llm():
    return ChatGroq(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        temperature=0.7,
        api_key=os.getenv("GROQ_API_KEY")
    )

def chat_con_orientatec(mensaje: str, historial: list[dict]) -> dict:
    llm = get_llm()

    mensajes = [SystemMessage(content=CONOCIMIENTO_ITSM)]

    for msg in historial:
        if msg["role"] == "user":
            mensajes.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            mensajes.append(AIMessage(content=msg["content"]))

    mensajes.append(HumanMessage(content=mensaje))

    respuesta = llm.invoke(mensajes)
    perfil = detectar_inclinacion(mensaje + " " + respuesta.content)

    return {
        "respuesta": respuesta.content,
        "perfil_detectado": perfil
    }

def detectar_inclinacion(texto: str) -> str | None:
    texto = texto.lower()
    señales = {
        "Informática / Sistemas":  ["programar", "codigo", "app", "web", "software", "computadora"],
        "Electrónica":             ["circuito", "electronica", "robotica", "automatizar", "sensor"],
        "Mecánica":                ["maquina", "motor", "mecanica", "taller", "piezas", "cad"],
        "Industrial":              ["procesos", "fabrica", "produccion", "logistica", "calidad"],
        "Energías Renovables":     ["solar", "eolica", "ambiente", "energia", "sustentable"],
        "Gestión Empresarial":     ["empresa", "negocio", "liderar", "emprender", "finanzas"]
    }
    for carrera, palabras in señales.items():
        if sum(1 for p in palabras if p in texto) >= 2:
            return carrera
    return None