from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship, DeclarativeBase

class Base(DeclarativeBase):
    pass

class CategoriaModel(Base):
    __tablename__ = "categoria"
    __table_args__ = {"schema": "inventario"}
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False)
    productos = relationship("ProductoModel", back_populates="categoria")

class ProductoModel(Base):
    __tablename__ = "producto"
    __table_args__ = (
        CheckConstraint("stock_actual >= 0", name="chk_stock_positivo"),
        {"schema": "inventario"}
    )
    id = Column(Integer, primary_key=True)
    nombre = Column(String(150), nullable=False)
    categoria_id = Column(Integer, ForeignKey("inventario.categoria.id"))
    precio_unitario = Column(Numeric(12, 2), nullable=False)
    stock_actual = Column(Integer, nullable=False, default=0)
    categoria = relationship("CategoriaModel", back_populates="productos")
