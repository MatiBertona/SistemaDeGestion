from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.categorias.domain.entities import CategoriaEntity
from app.categorias.domain.repository_interface import CategoriaRepository
from app.productos.infrastructure.database.models import CategoriaModel

class SQLAlchemyCategoriaRepository(CategoriaRepository):
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[CategoriaEntity]:
        result = await self.db.execute(select(CategoriaModel))
        models = result.scalars().all()
        return [CategoriaEntity(id=m.id, nombre=m.nombre) for m in models]
