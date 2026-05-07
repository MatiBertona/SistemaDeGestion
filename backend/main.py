from fastapi import FastAPI

app = FastAPI(title="Inventory API")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend"}
