from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.productos.domain.entities import ProductoEntity, MovimientoEntity
from app.categorias.domain.entities import CategoriaEntity
from app.productos.domain.repository_interface import ProductoRepository
from app.productos.infrastructure.database.models import ProductoModel, CategoriaModel, MovimientoModel

class SQLAlchemyProductoRepository(ProductoRepository):
    def __init__(self, session: AsyncSession):
        self.session = session

    def _to_entity(self, model: ProductoModel) -> ProductoEntity:
        return ProductoEntity(
            id=model.id,
            nombre=model.nombre,
            sku=model.sku,
            precio_unitario=float(model.precio_unitario),
            stock_actual=model.stock_actual,
            min_stock=model.min_stock,
            max_stock=model.max_stock,
            categoria=CategoriaEntity(
                id=model.categoria.id, 
                nombre=model.categoria.nombre,
                descripcion=model.categoria.descripcion
            ) if model.categoria else None
        )

    async def get_all(self, categoria_nombre: Optional[str] = None) -> List[ProductoEntity]:
        query = select(ProductoModel).options(joinedload(ProductoModel.categoria))
        if categoria_nombre:
            query = query.join(ProductoModel.categoria).filter(CategoriaModel.nombre.ilike(f"%{categoria_nombre}%"))
        
        result = await self.session.execute(query)
        models = result.unique().scalars().all()
        return [self._to_entity(m) for m in models]

    async def get_by_id(self, id: int) -> Optional[ProductoEntity]:
        query = select(ProductoModel).options(joinedload(ProductoModel.categoria)).where(ProductoModel.id == id)
        result = await self.session.execute(query)
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def save(self, entity: ProductoEntity) -> ProductoEntity:
        model = await self.session.get(ProductoModel, entity.id) if entity.id else None
        if not model:
            model = ProductoModel(
                nombre=entity.nombre,
                sku=entity.sku,
                precio_unitario=entity.precio_unitario,
                stock_actual=entity.stock_actual,
                min_stock=entity.min_stock,
                max_stock=entity.max_stock,
                categoria_id=entity.categoria.id if entity.categoria else None
            )
            self.session.add(model)
        else:
            model.nombre = entity.nombre
            model.precio_unitario = entity.precio_unitario
            model.stock_actual = entity.stock_actual
            model.min_stock = entity.min_stock
            model.max_stock = entity.max_stock
            model.categoria_id = entity.categoria.id if entity.categoria else None
        
        await self.session.flush()
        # Cargar la relación categoría para el mapeo a entidad
        query = select(ProductoModel).options(joinedload(ProductoModel.categoria)).where(ProductoModel.id == model.id)
        result = await self.session.execute(query)
        model = result.scalar_one()
        return self._to_entity(model)

    async def add_movement(self, movimiento: MovimientoEntity) -> MovimientoEntity:
        model = MovimientoModel(
            producto_id=movimiento.producto_id,
            tipo=movimiento.tipo,
            cantidad=movimiento.cantidad,
            motivo=movimiento.motivo,
            usuario=movimiento.usuario
        )
        self.session.add(model)
        
        # Actualizar stock del producto
        producto = await self.session.get(ProductoModel, movimiento.producto_id)
        if movimiento.tipo == "ENTRADA":
            producto.stock_actual += movimiento.cantidad
        else:
            producto.stock_actual -= movimiento.cantidad
            
        await self.session.flush()
        return MovimientoEntity(
            id=model.id,
            producto_id=model.producto_id,
            tipo=model.tipo.value,
            cantidad=model.cantidad,
            fecha=model.fecha,
            motivo=model.motivo,
            usuario=model.usuario
        )

    async def get_movements(self, producto_id: int) -> List[MovimientoEntity]:
        query = select(MovimientoModel).where(MovimientoModel.producto_id == producto_id).order_by(MovimientoModel.fecha.desc())
        result = await self.session.execute(query)
        models = result.scalars().all()
        return [
            MovimientoEntity(
                id=m.id,
                producto_id=m.producto_id,
                tipo=m.tipo.value,
                cantidad=m.cantidad,
                fecha=m.fecha,
                motivo=m.motivo,
                usuario=m.usuario
            ) for m in models
        ]
