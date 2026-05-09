from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.categorias.infrastructure.database.repository import SQLAlchemyCategoriaRepository
from app.categorias.application.services import ListarCategoriasService
from app.categorias.infrastructure.http.schemas import CategoriaResource

router = APIRouter(prefix="/categorias", tags=["Categorías"])

@router.get("", response_model=List[CategoriaResource])
async def listar_categorias(db: AsyncSession = Depends(get_db)):
    repository = SQLAlchemyCategoriaRepository(db)
    service = ListarCategoriasService(repository)
    return await service.execute()
