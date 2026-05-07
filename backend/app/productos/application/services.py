from typing import List, Optional
from ..domain.entities import ProductoEntity
from ..domain.repository_interface import ProductoRepository

class ListarProductosService:
    def __init__(self, repository: ProductoRepository):
        self.repository = repository

    async def execute(self, categoria: Optional[str] = None) -> List[ProductoEntity]:
        return await self.repository.get_all(categoria_nombre=categoria)
