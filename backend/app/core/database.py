from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Usar la variable de entorno si existe, sino el default
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:supersecretpassword@db:5432/inventario_db")

    class Config:
        env_file = ".env"

settings = Settings()
engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
