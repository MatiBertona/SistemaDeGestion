from fastapi import FastAPI
from app.productos.infrastructure.http.controller import router as productos_router

app = FastAPI(title="Inventory API")

app.include_router(productos_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend"}
