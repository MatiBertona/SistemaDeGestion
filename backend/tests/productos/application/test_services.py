import pytest
from unittest.mock import AsyncMock
from app.productos.application.services import ListarProductosService
from app.productos.domain.entities import ProductoEntity

@pytest.mark.asyncio
async def test_listar_productos_service_returns_all_products():
    # Arrange
    mock_repository = AsyncMock()
    expected_products = [
        ProductoEntity(id=1, nombre="P1", precio_unitario=10.0, stock_actual=5),
        ProductoEntity(id=2, nombre="P2", precio_unitario=20.0, stock_actual=10),
    ]
    mock_repository.get_all.return_value = expected_products
    service = ListarProductosService(mock_repository)

    # Act
    result = await service.execute()

    # Assert
    assert result == expected_products
    mock_repository.get_all.assert_called_once_with(categoria_nombre=None)

@pytest.mark.asyncio
async def test_listar_productos_service_filters_by_category():
    # Arrange
    mock_repository = AsyncMock()
    category = "Electronics"
    expected_products = [
        ProductoEntity(id=1, nombre="P1", precio_unitario=10.0, stock_actual=5),
    ]
    mock_repository.get_all.return_value = expected_products
    service = ListarProductosService(mock_repository)

    # Act
    result = await service.execute(categoria=category)

    # Assert
    assert result == expected_products
    mock_repository.get_all.assert_called_once_with(categoria_nombre=category)
