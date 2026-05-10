from dataclasses import dataclass
from typing import Optional

@dataclass
class CategoriaEntity:
    id: int
    nombre: str
    descripcion: Optional[str] = None
