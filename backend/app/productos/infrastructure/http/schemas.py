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
    sku: str
    precio_unitario: float
    stock_actual: int
    min_stock: int
    max_stock: int
    categoria: Optional[CategoriaResource]

    class Config:
        from_attributes = True

class ProductoCreate(BaseModel):
    nombre: str
    sku: str
    precio_unitario: float
    min_stock: int
    max_stock: int
    categoria_id: int

