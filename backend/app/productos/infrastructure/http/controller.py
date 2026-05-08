from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from ..database.repository import SQLAlchemyProductoRepository
from ...application.services import ListarProductosService
from .schemas import ProductoResource

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("", response_model=List[ProductoResource])
async def listar_productos(
    categoria: Optional[str] = Query(None, description="Filtrar por nombre de categoría"),
    db: AsyncSession = Depends(get_db)
):
    repository = SQLAlchemyProductoRepository(db)
    service = ListarProductosService(repository)
    return await service.execute(categoria=categoria)
