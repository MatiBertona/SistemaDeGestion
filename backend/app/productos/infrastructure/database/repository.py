from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.productos.domain.entities import ProductoEntity
from app.categorias.domain.entities import CategoriaEntity
from app.productos.domain.repository_interface import ProductoRepository
from .models import ProductoModel, CategoriaModel

class SQLAlchemyProductoRepository(ProductoRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all(self, categoria_nombre: Optional[str] = None) -> List[ProductoEntity]:
        query = select(ProductoModel).options(joinedload(ProductoModel.categoria))
        
        if categoria_nombre:
            query = query.join(ProductoModel.categoria).filter(CategoriaModel.nombre.ilike(f"%{categoria_nombre}%"))
        
        result = await self.session.execute(query)
        models = result.scalars().all()
        
        return [
            ProductoEntity(
                id=m.id,
                nombre=m.nombre,
                precio_unitario=float(m.precio_unitario),
                stock_actual=m.stock_actual,
                categoria=CategoriaEntity(id=m.categoria.id, nombre=m.categoria.nombre) if m.categoria else None
            ) for m in models
        ]
