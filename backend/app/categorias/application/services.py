from typing import List
from app.categorias.domain.repository_interface import CategoriaRepository
from app.categorias.domain.entities import CategoriaEntity

class ListarCategoriasService:
    def __init__(self, repository: CategoriaRepository):
        self.repository = repository

    async def execute(self) -> List[CategoriaEntity]:
        return await self.repository.get_all()
