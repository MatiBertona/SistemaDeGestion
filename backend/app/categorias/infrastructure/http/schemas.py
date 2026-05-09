from pydantic import BaseModel
from typing import Optional

class CategoriaCreate(BaseModel):
    nombre: str

class CategoriaResource(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True
