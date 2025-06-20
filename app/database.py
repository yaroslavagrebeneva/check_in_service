from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.ext.asyncio import AsyncEngine
from typing import AsyncGenerator

# Конфигурация подключения к базе данных
DATABASE_URL = "postgresql+asyncpg://postgres:slava2006@localhost:5432/girls_app"

# Создание асинхронного движка
engine = create_async_engine(DATABASE_URL, echo=True)  # echo=True для отладки SQL

# Создание фабрики сессий
async_session_factory = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session

# База для декларативных моделей
Base = declarative_base()