from abc import ABC, abstractmethod
from typing import List, Optional
from .entities import ProductoEntity

class ProductoRepository(ABC):
    @abstractmethod
    async def get_all(self, categoria_nombre: Optional[str] = None) -> List[ProductoEntity]:
        pass
