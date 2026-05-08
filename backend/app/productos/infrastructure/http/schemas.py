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
