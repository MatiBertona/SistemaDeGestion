from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class MovementType(str, Enum):
    ENTRADA = "ENTRADA"
    SALIDA = "SALIDA"

class MovimientoCreate(BaseModel):
    producto_id: int
    tipo: MovementType
    cantidad: int
    motivo: Optional[str] = None

class MovimientoResource(BaseModel):
    id: int
    producto_id: int
    tipo: MovementType
    cantidad: int
    fecha: datetime
    motivo: Optional[str] = None
    usuario: Optional[str] = None

    class Config:
        from_attributes = True
