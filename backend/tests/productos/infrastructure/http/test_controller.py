import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_listar_productos_returns_200():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/productos")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
