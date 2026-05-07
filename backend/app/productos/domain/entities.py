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
