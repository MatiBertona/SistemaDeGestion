import asyncio
import pytest
import pytest_asyncio
from typing import Generator

@pytest.fixture(scope="session")
def event_loop() -> Generator:
    """Crea una instancia del event loop para toda la sesión de pruebas."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()
