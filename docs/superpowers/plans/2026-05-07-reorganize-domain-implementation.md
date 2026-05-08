# Reorganize Domain Implementation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the domain implementation into independent folders for each domain (productos and categorias).

**Architecture:** Split domain entities into respective packages. Move `CategoriaEntity` to a new `categorias` package and update `ProductoEntity` to import it.

**Tech Stack:** Python 3.12, Dataclasses

---

### Task 1: Create Categorias Domain Package

**Files:**
- Create: `backend/app/categorias/__init__.py`
- Create: `backend/app/categorias/domain/__init__.py`
- Create: `backend/app/categorias/domain/entities.py`

- [x] **Step 1: Create directories and __init__.py files**

Run: `mkdir -p backend/app/categorias/domain && touch backend/app/categorias/__init__.py backend/app/categorias/domain/__init__.py`

- [x] **Step 2: Create CategoriaEntity**

```python
from dataclasses import dataclass

@dataclass
class CategoriaEntity:
    id: int
    nombre: str
```

File: `backend/app/categorias/domain/entities.py`

### Task 2: Update Productos Domain Entities

**Files:**
- Modify: `backend/app/productos/domain/entities.py`

- [x] **Step 1: Update ProductoEntity to import CategoriaEntity and remove old definition**

```python
from dataclasses import dataclass
from typing import Optional
from app.categorias.domain.entities import CategoriaEntity

@dataclass
class ProductoEntity:
    id: int
    nombre: str
    precio_unitario: float
    stock_actual: int
    categoria: Optional[CategoriaEntity] = None
```

File: `backend/app/productos/domain/entities.py`

### Task 3: Verification

- [x] **Step 1: Verify imports in repository_interface.py**

Run: `python3 -c "from app.productos.domain.repository_interface import ProductoRepository; print('Success')"`
(Need to set PYTHONPATH or run from backend directory)

- [x] **Step 2: Verify ProductoEntity can be instantiated**

Run: `python3 -c "from app.productos.domain.entities import ProductoEntity; from app.categorias.domain.entities import CategoriaEntity; c = CategoriaEntity(1, 'cat'); p = ProductoEntity(1, 'prod', 10.0, 5, c); print(p)"`
