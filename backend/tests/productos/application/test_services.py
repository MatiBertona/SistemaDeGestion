import pytest
from unittest.mock import AsyncMock
from app.productos.application.services import ListarProductosService
from app.productos.domain.entities import ProductoEntity

@pytest.mark.asyncio
async def test_listar_productos_service_calls_repository():
    # Arrange
    mock_repo = AsyncMock()
    mock_repo.get_all.return_value = []
    service = ListarProductosService(mock_repo)
    
    # Act
    await service.execute(categoria_nombre="test")
    
    # Assert
    mock_repo.get_all.assert_called_once_with(categoria_nombre="test")

@pytest.mark.asyncio
async def test_listar_productos_service_returns_list():
    # Arrange
    mock_repo = AsyncMock()
    expected_data = [ProductoEntity(id=1, nombre="Test", sku="SKU-1", precio_unitario=10.0, stock_actual=5, min_stock=1, max_stock=10)]
    mock_repo.get_all.return_value = expected_data
    service = ListarProductosService(mock_repo)
    
    # Act
    result = await service.execute()
    
    # Assert
    assert result == expected_data
