from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.productos.infrastructure.http.controller import router as productos_router
from app.categorias.infrastructure.http.controller import router as categorias_router

app = FastAPI(title="Inventory API")

# Configuración de CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(productos_router)
app.include_router(categorias_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend"}
