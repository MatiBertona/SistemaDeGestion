from abc import ABC, abstractmethod
from typing import List, Optional
from app.productos.domain.entities import ProductoEntity, MovimientoEntity

class ProductoRepository(ABC):
    @abstractmethod
    async def get_all(self, categoria: Optional[str] = None) -> List[ProductoEntity]:
        pass

    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[ProductoEntity]:
        pass

    @abstractmethod
    async def save(self, producto: ProductoEntity) -> ProductoEntity:
        pass

    @abstractmethod
    async def add_movement(self, movimiento: MovimientoEntity) -> MovimientoEntity:
        pass

    @abstractmethod
    async def get_movements(self, producto_id: int) -> List[MovimientoEntity]:
        pass
