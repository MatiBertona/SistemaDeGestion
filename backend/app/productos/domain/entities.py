from dataclasses import dataclass, field
from typing import Optional, List
from app.categorias.domain.entities import CategoriaEntity
from datetime import datetime

@dataclass
class ProductoEntity:
    id: int
    nombre: str
    sku: str
    precio_unitario: float
    stock_actual: int
    min_stock: int
    max_stock: int
    categoria: Optional[CategoriaEntity] = None

@dataclass
class MovimientoEntity:
    id: int
    producto_id: int
    tipo: str
    cantidad: int
    fecha: datetime
    motivo: Optional[str] = None
    usuario: Optional[str] = None
