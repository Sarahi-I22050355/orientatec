from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from models.schemas import PerfilAspirante, ResultadoCarrera

# ─── BASE DE CONOCIMIENTO DE CARRERAS ────────────────────────────────────────
# Cada carrera tiene un vector de pesos que representa su perfil ideal
# [logica, diseno, liderazgo, manual]

CARRERAS = {
    "ING_INFORMATICA": {
        "nombre": "Ingeniería en Informática",
        "vector": [95, 70, 50, 30],
        "keywords": ["programacion", "software", "aplicaciones", "codigo", "web", "movil", "computadora", "sistemas", "redes", "ciberseguridad"],
        "entornos": ["remoto", "oficina", "tecnologia"],
        "razonamiento": "Tu perfil analítico y afinidad con la tecnología encajan perfectamente con el desarrollo de software y la gestión de infraestructura TI, sectores de alta demanda en la región.",
        "accion": "Invitarte al taller de desarrollo de apps móviles del campus."
    },
    "ING_INDUSTRIAL": {
        "nombre": "Ingeniería Industrial",
        "vector": [80, 55, 85, 60],
        "keywords": ["procesos", "fabrica", "produccion", "logistica", "calidad", "manufactura", "planta", "eficiencia"],
        "entornos": ["fabrica", "planta", "industria"],
        "razonamiento": "Tu capacidad de liderazgo y visión de procesos te posicionan para optimizar plantas industriales en el corredor manufacturero de Monclova.",
        "accion": "Agendarte una visita guiada a las instalaciones de manufactura del campus."
    },
    "ING_ELECTRONICA": {
        "nombre": "Ingeniería en Electrónica",
        "vector": [90, 65, 40, 85],
        "keywords": ["circuitos", "electronica", "electricidad", "sensores", "automatizacion", "control", "robotica", "instrumentacion"],
        "entornos": ["laboratorio", "planta", "taller"],
        "razonamiento": "Tu interés en circuitos y sistemas de control es clave para la automatización industrial, una de las áreas más demandadas en Monclova y la región norte.",
        "accion": "Enviarte información sobre el laboratorio de robótica e instrumentación."
    },
    "ING_MECANICA": {
        "nombre": "Ingeniería en Mecánica",
        "vector": [85, 80, 45, 95],
        "keywords": ["maquinas", "mecanica", "mantenimiento", "metalurgia", "cad", "diseno", "piezas", "maquinaria", "pesada", "fierros"],
        "entornos": ["taller", "planta", "industria pesada"],
        "razonamiento": "Tu habilidad manual y pasión por la maquinaria pesada te preparan para diseñar y mantener sistemas mecánicos en las industrias del acero y manufactura de la región.",
        "accion": "Invitarte al taller de diseño CAD/CAM del campus."
    },
    "ING_ENERGIAS": {
        "nombre": "Ingeniería en Energías Renovables",
        "vector": [80, 70, 55, 65],
        "keywords": ["solar", "eolica", "ambiente", "sustentable", "energia", "renovable", "ecologia", "electrica", "paneles"],
        "entornos": ["campo", "exterior", "sustentabilidad"],
        "razonamiento": "Tu conciencia ambiental y base técnica te convierten en un perfil ideal para liderar la transición energética que demanda el sector industrial del norte del país.",
        "accion": "Compartirte el proyecto de instalación solar fotovoltaica del campus."
    },
    "ING_GESTION": {
        "nombre": "Ingeniería en Gestión Empresarial",
        "vector": [65, 55, 95, 40],
        "keywords": ["empresa", "negocio", "liderazgo", "administracion", "finanzas", "marketing", "emprendimiento", "gestion", "equipo"],
        "entornos": ["oficina", "empresa", "emprendimiento"],
        "razonamiento": "Tu perfil de liderazgo y visión empresarial te posicionan para dirigir equipos y crear modelos de negocio en el dinámico ecosistema industrial de Coahuila.",
        "accion": "Invitarte al programa de emprendimiento e incubadora de negocios del campus."
    }
}

# ─── FUNCIÓN PRINCIPAL DE MATCH ───────────────────────────────────────────────

def calcular_match(perfil: PerfilAspirante) -> list[ResultadoCarrera]:
    # Vector del aspirante
    vector_aspirante = np.array([[
        perfil.habilidad_logica,
        perfil.habilidad_diseno,
        perfil.habilidad_liderazgo,
        perfil.habilidad_manual
    ]])

    resultados = []

    for carrera_id, carrera in CARRERAS.items():
        vector_carrera = np.array([carrera["vector"]])

        # Similitud base por habilidades (coseno)
        similitud = cosine_similarity(vector_aspirante, vector_carrera)[0][0]
        score = similitud * 70  # 70% del puntaje viene de habilidades

        # Bonus por keywords en texto libre
        if perfil.texto_libre:
            texto = perfil.texto_libre.lower()
            coincidencias = sum(1 for kw in carrera["keywords"] if kw in texto)
            bonus_keywords = min(coincidencias * 4, 20)  # máximo 20 puntos
            score += bonus_keywords

        # Bonus por entorno laboral
        entorno = perfil.entorno_laboral.lower()
        if any(e in entorno for e in carrera["entornos"]):
            score += 10  # 10 puntos extra por match de entorno

        # Normalizar a 100
        score = min(round(score, 1), 100.0)

        resultados.append(ResultadoCarrera(
            carrera_id=carrera_id,
            nombre_carrera=carrera["nombre"],
            porcentaje_match=score,
            razonamiento=carrera["razonamiento"]
        ))

    # Ordenar de mayor a menor match
    resultados.sort(key=lambda x: x.porcentaje_match, reverse=True)
    return resultados[:3]  # Top 3 carreras


def detectar_perfil(resultados: list[ResultadoCarrera]) -> str:
    top = resultados[0].carrera_id
    perfiles = {
        "ING_INFORMATICA":  "Perfil tecnológico-digital",
        "ING_INDUSTRIAL":   "Perfil de optimización y procesos",
        "ING_ELECTRONICA":  "Perfil electrónico-automatización",
        "ING_MECANICA":     "Perfil mecánico-industrial",
        "ING_ENERGIAS":     "Perfil sustentable-energético",
        "ING_GESTION":      "Perfil empresarial-líder"
    }
    return perfiles.get(top, "Perfil mixto")