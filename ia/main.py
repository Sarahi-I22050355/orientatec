from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import vocacional, chat

app = FastAPI(
    title="OrientaTec IA",
    description="Motor de inteligencia artificial para orientación vocacional - TecNM Campus Monclova",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vocacional.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {
        "sistema": "OrientaTec IA",
        "version": "1.0.0",
        "campus": "TecNM Campus Monclova",
        "status": "activo"
    }