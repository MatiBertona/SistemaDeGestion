from typing import List, Optional
from app.productos.domain.repository_interface import ProductoRepository
from app.productos.domain.entities import ProductoEntity, MovimientoEntity

class RegistrarMovimientoService:
    def __init__(self, repository: ProductoRepository):
        self.repository = repository

    async def execute(self, producto_id: int, tipo: str, cantidad: int, motivo: Optional[str] = None, usuario: Optional[str] = None) -> MovimientoEntity:
        producto = await self.repository.get_by_id(producto_id)
        if not producto:
            raise ValueError(f"Producto con ID {producto_id} no encontrado")

        if tipo == "SALIDA" and producto.stock_actual < cantidad:
            raise ValueError("Stock insuficiente para realizar la salida")

        movimiento = MovimientoEntity(
            id=0, # Autogenerado por DB
            producto_id=producto_id,
            tipo=tipo,
            cantidad=cantidad,
            fecha=None, # Asignado por DB
            motivo=motivo,
            usuario=usuario
        )
        
        return await self.repository.add_movement(movimiento)

class CrearProductoService:
    def __init__(self, repository: ProductoRepository):
        self.repository = repository

    async def execute(self, nombre: str, sku: str, precio_unitario: float, min_stock: int, max_stock: int, categoria_id: int) -> ProductoEntity:
        from app.categorias.domain.entities import CategoriaEntity
        
        producto = ProductoEntity(
            id=0,
            nombre=nombre,
            sku=sku,
            precio_unitario=precio_unitario,
            stock_actual=0,
            min_stock=min_stock,
            max_stock=max_stock,
            categoria=CategoriaEntity(id=categoria_id, nombre="") # El repo usará el ID
        )
        return await self.repository.save(producto)
