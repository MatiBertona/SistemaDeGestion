from abc import ABC, abstractmethod
from typing import List
from app.categorias.domain.entities import CategoriaEntity

class CategoriaRepository(ABC):
    @abstractmethod
    async def get_all(self) -> List[CategoriaEntity]:
        pass
