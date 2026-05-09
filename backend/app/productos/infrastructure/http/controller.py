from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.productos.infrastructure.database.repository import SQLAlchemyProductoRepository
from app.productos.application.services import ListarProductosService
from app.productos.application.movement_services import RegistrarMovimientoService, CrearProductoService
from app.productos.infrastructure.http.schemas import ProductoResource, ProductoCreate
from app.productos.infrastructure.http.movement_schemas import MovimientoResource, MovimientoCreate

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("", response_model=List[ProductoResource])
async def listar_productos(
    categoria: Optional[str] = Query(None, description="Filtrar por nombre de categoría"),
    db: AsyncSession = Depends(get_db)
):
    repository = SQLAlchemyProductoRepository(db)
    service = ListarProductosService(repository)
    return await service.execute(categoria_nombre=categoria)

@router.post("", response_model=ProductoResource)
async def crear_producto(
    producto: ProductoCreate,
    db: AsyncSession = Depends(get_db)
):
    repository = SQLAlchemyProductoRepository(db)
    service = CrearProductoService(repository)
    return await service.execute(
        nombre=producto.nombre,
        sku=producto.sku,
        precio_unitario=producto.precio_unitario,
        min_stock=producto.min_stock,
        max_stock=producto.max_stock,
        categoria_id=producto.categoria_id
    )

@router.post("/movimientos", response_model=MovimientoResource)
async def registrar_movimiento(
    movimiento: MovimientoCreate,
    db: AsyncSession = Depends(get_db)
):
    repository = SQLAlchemyProductoRepository(db)
    service = RegistrarMovimientoService(repository)
    try:
        return await service.execute(
            producto_id=movimiento.producto_id,
            tipo=movimiento.tipo.value,
            cantidad=movimiento.cantidad,
            motivo=movimiento.motivo
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{producto_id}/movimientos", response_model=List[MovimientoResource])
async def listar_movimientos_producto(
    producto_id: int,
    db: AsyncSession = Depends(get_db)
):
    repository = SQLAlchemyProductoRepository(db)
    return await repository.get_movements(producto_id)
