from fastapi import FastAPI
from app.productos.infrastructure.http.controller import router as productos_router
from app.categorias.infrastructure.http.controller import router as categorias_router

app = FastAPI(title="Inventory API")

app.include_router(productos_router)
app.include_router(categorias_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend"}
