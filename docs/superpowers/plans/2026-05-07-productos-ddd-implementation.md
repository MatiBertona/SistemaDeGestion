# Plan de Implementación: Listado de Productos (DDD + Arquitectura Hexagonal)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar un endpoint de listado de productos con stock y filtro de categoría, siguiendo principios de DDD y Arquitectura Hexagonal.

**Architecture:** Domain-Driven Design (Domain, Application, Infrastructure), Hexagonal, FastAPI, SQLAlchemy (Async).

**Tech Stack:** Python 3.11, FastAPI, SQLAlchemy 2.0, Asyncpg.

---

### Task 1: Configuración Base de Base de Datos (Async)

**Files:**
- Create: `backend/app/core/database.py`

- [ ] **Step 1: Crear configuración de sesión asíncrona**
```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:supersecretpassword@db:5432/inventario_db"

    class Config:
        env_file = ".env"

settings = Settings()
engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
```

- [ ] **Step 2: Commit**
```bash
git add backend/app/core/database.py
git commit -m "chore: add async database configuration"
```

### Task 2: Capa de Dominio (Entities e Interfaces)

**Files:**
- Create: `backend/app/productos/domain/entities.py`
- Create: `backend/app/productos/domain/repository_interface.py`

- [ ] **Step 1: Definir Entidades de Dominio**
```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class CategoriaEntity:
    id: int
    nombre: str

@dataclass
class ProductoEntity:
    id: int
    nombre: str
    precio_unitario: float
    stock_actual: int
    categoria: Optional[CategoriaEntity] = None
```

- [ ] **Step 2: Definir Interfaz de Repositorio**
```python
from abc import ABC, abstractmethod
from typing import List, Optional
from .entities import ProductoEntity

class ProductoRepository(ABC):
    @abstractmethod
    async def get_all(self, categoria_nombre: Optional[str] = None) -> List[ProductoEntity]:
        pass
```

- [ ] **Step 3: Commit**
```bash
git add backend/app/productos/domain/
git commit -m "feat: add product domain entities and repository interface"
```

### Task 3: Capa de Aplicación (Service)

**Files:**
- Create: `backend/app/productos/application/services.py`

- [ ] **Step 1: Implementar Servicio de Aplicación**
```python
from typing import List, Optional
from ..domain.entities import ProductoEntity
from ..domain.repository_interface import ProductoRepository

class ListarProductosService:
    def __init__(self, repository: ProductoRepository):
        self.repository = repository

    async def execute(self, categoria: Optional[str] = None) -> List[ProductoEntity]:
        return await self.repository.get_all(categoria_nombre=categoria)
```

- [ ] **Step 2: Commit**
```bash
git add backend/app/productos/application/
git commit -m "feat: add application service for listing products"
```

### Task 4: Capa de Infraestructura (Persistencia)

**Files:**
- Create: `backend/app/productos/infrastructure/database/models.py`
- Create: `backend/app/productos/infrastructure/database/repository.py`

- [ ] **Step 1: Definir Modelos de SQLAlchemy**
```python
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship, DeclarativeBase

class Base(DeclarativeBase):
    pass

class CategoriaModel(Base):
    __tablename__ = "categoria"
    __table_args__ = {"schema": "inventario"}
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    productos = relationship("ProductoModel", back_populates="categoria")

class ProductoModel(Base):
    __tablename__ = "producto"
    __table_args__ = (
        CheckConstraint("stock_actual >= 0", name="chk_stock_positivo"),
        {"schema": "inventario"}
    )
    id = Column(Integer, primary_key=True)
    nombre = Column(String(150), nullable=False)
    categoria_id = Column(Integer, ForeignKey("inventario.categoria.id"))
    precio_unitario = Column(Numeric(12, 2), nullable=False)
    stock_actual = Column(Integer, nullable=False, default=0)
    categoria = relationship("CategoriaModel", back_populates="productos")
```

- [ ] **Step 2: Implementar Repositorio con Mapeo**
```python
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from ...domain.entities import ProductoEntity, CategoriaEntity
from ...domain.repository_interface import ProductoRepository
from .models import ProductoModel, CategoriaModel

class SQLAlchemyProductoRepository(ProductoRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self, categoria_nombre: Optional[str] = None) -> List[ProductoEntity]:
        query = select(ProductoModel).options(joinedload(ProductoModel.categoria))
        
        if categoria_nombre:
            query = query.join(ProductoModel.categoria).filter(CategoriaModel.nombre.ilike(f"%{categoria_nombre}%"))
        
        result = await self.session.execute(query)
        models = result.scalars().all()
        
        return [
            ProductoEntity(
                id=m.id,
                nombre=m.nombre,
                precio_unitario=float(m.precio_unitario),
                stock_actual=m.stock_actual,
                categoria=CategoriaEntity(id=m.categoria.id, nombre=m.categoria.nombre) if m.categoria else None
            ) for m in models
        ]
```

- [ ] **Step 3: Commit**
```bash
git add backend/app/productos/infrastructure/database/
git commit -m "feat: add sqlalchemy models and repository implementation"
```

### Task 5: Capa de Infraestructura (HTTP Controller y Schemas)

**Files:**
- Create: `backend/app/productos/infrastructure/http/schemas.py`
- Create: `backend/app/productos/infrastructure/http/controller.py`
- Modify: `backend/main.py`

- [ ] **Step 1: Definir Schemas de Pydantic (Resources)**
```python
from pydantic import BaseModel
from typing import Optional

class CategoriaResource(BaseModel):
    id: int
    nombre: str

class ProductoResource(BaseModel):
    id: int
    nombre: str
    precio_unitario: float
    stock_actual: int
    categoria: Optional[CategoriaResource]
```

- [ ] **Step 2: Implementar Controller de FastAPI**
```python
from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from ....core.database import get_db
from ..database.repository import SQLAlchemyProductoRepository
from ...application.services import ListarProductosService
from .schemas import ProductoResource

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("", response_model=List[ProductoResource])
async def listar_productos(
    categoria: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repository = SQLAlchemyProductoRepository(db)
    service = ListarProductosService(repository)
    return await service.execute(categoria=categoria)
```

- [ ] **Step 3: Registrar Router en main.py**
```python
from fastapi import FastAPI
from app.productos.infrastructure.http.controller import router as productos_router

app = FastAPI(title="Inventory API")
app.include_router(productos_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "backend"}
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: add fast-api controller and schemas for products"
```

### Task 6: Verificación Final

- [ ] **Step 1: Reiniciar Contenedores**
```bash
docker compose build backend && docker compose up -d
```

- [ ] **Step 2: Probar Endpoint General**
```bash
curl http://localhost:8000/productos
```
Expected: JSON con los 4 productos de ejemplo.

- [ ] **Step 3: Probar Filtro por Categoría**
```bash
curl "http://localhost:8000/productos?categoria=Electronica"
```
Expected: JSON con solo los productos de Electrónica.

- [ ] **Step 4: Commit final**
```bash
git commit --allow-empty -m "test: verify DDD implementation for products listing"
```
