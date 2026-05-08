# Task 5: Capa de Infraestructura (HTTP Controller y Schemas) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the HTTP controller and Pydantic schemas for the `productos` domain to enable listing products via a REST API.

**Architecture:** Following DDD, this task adds the HTTP delivery layer within `infrastructure`. It uses Pydantic for DTOs (schemas) and FastAPI's `APIRouter` for the controller, delegating business logic to the application layer.

**Tech Stack:** Python, FastAPI, Pydantic, SQLAlchemy, Pytest, HTTPX.

---

### Task 1: Create HTTP Infrastructure Directory and Schemas

**Files:**
- Create: `backend/app/productos/infrastructure/http/__init__.py`
- Create: `backend/app/productos/infrastructure/http/schemas.py`

- [ ] **Step 1: Create directory and __init__.py**

```bash
mkdir -p backend/app/productos/infrastructure/http/
touch backend/app/productos/infrastructure/http/__init__.py
```

- [ ] **Step 2: Create Pydantic schemas**

```python
from pydantic import BaseModel
from typing import Optional

class CategoriaResource(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True

class ProductoResource(BaseModel):
    id: int
    nombre: str
    precio_unitario: float
    stock_actual: int
    categoria: Optional[CategoriaResource]

    class Config:
        from_attributes = True
```

### Task 2: Implement HTTP Controller

**Files:**
- Create: `backend/app/productos/infrastructure/http/controller.py`

- [ ] **Step 1: Write controller with product listing endpoint**

```python
from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from ..database.repository import SQLAlchemyProductoRepository
from ...application.services import ListarProductosService
from .schemas import ProductoResource

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("", response_model=List[ProductoResource])
async def listar_productos(
    categoria: Optional[str] = Query(None, description="Filtrar por nombre de categoría"),
    db: AsyncSession = Depends(get_db)
):
    repository = SQLAlchemyProductoRepository(db)
    service = ListarProductosService(repository)
    return await service.execute(categoria=categoria)
```

### Task 3: Register Router in Main Application

**Files:**
- Modify: `backend/main.py`

- [ ] **Step 1: Update main.py to include productos router**

```python
from fastapi import FastAPI
from app.productos.infrastructure.http.controller import router as productos_router

app = FastAPI(title="Inventory API")

app.include_router(productos_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend"}
```

### Task 4: Verification with Integration Test

**Files:**
- Create: `backend/tests/productos/infrastructure/http/test_controller.py`

- [ ] **Step 1: Write integration test for listing products**

```python
import pytest
from httpx import AsyncClient
from backend.main import app

@pytest.mark.asyncio
async def test_listar_productos_returns_200():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/productos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

- [ ] **Step 2: Run tests**

Run: `pytest backend/tests/productos/infrastructure/http/test_controller.py`
Expected: PASS (assuming DB is up or mocked, for now just checking integration and structure).
