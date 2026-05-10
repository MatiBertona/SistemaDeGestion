from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, CheckConstraint, DateTime, Enum
from sqlalchemy.orm import relationship, DeclarativeBase
import enum
from datetime import datetime

class Base(DeclarativeBase):
    pass

class MovementType(enum.Enum):
    ENTRADA = "ENTRADA"
    SALIDA = "SALIDA"

class CategoriaModel(Base):
    __tablename__ = "categoria"
    __table_args__ = {"schema": "inventario"}
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255))
    productos = relationship("ProductoModel", back_populates="categoria")

class ProductoModel(Base):
    __tablename__ = "producto"
    __table_args__ = (
        CheckConstraint("stock_actual >= 0", name="chk_stock_positivo"),
        {"schema": "inventario"}
    )
    id = Column(Integer, primary_key=True)
    nombre = Column(String(150), nullable=False)
    sku = Column(String(50), nullable=False, unique=True)
    categoria_id = Column(Integer, ForeignKey("inventario.categoria.id"))
    precio_unitario = Column(Numeric(12, 2), nullable=False)
    stock_actual = Column(Integer, nullable=False, default=0)
    min_stock = Column(Integer, nullable=False, default=10)
    max_stock = Column(Integer, nullable=False, default=100)
    categoria = relationship("CategoriaModel", back_populates="productos")
    movimientos = relationship("MovimientoModel", back_populates="producto")

class MovimientoModel(Base):
    __tablename__ = "movimiento"
    __table_args__ = {"schema": "inventario"}
    id = Column(Integer, primary_key=True)
    producto_id = Column(Integer, ForeignKey("inventario.producto.id"), nullable=False)
    tipo = Column(Enum(MovementType, native_enum=False), nullable=False)
    cantidad = Column(Integer, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)
    motivo = Column(String(255))
    usuario = Column(String(100))
    producto = relationship("ProductoModel", back_populates="movimientos")
