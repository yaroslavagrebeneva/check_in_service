from sqlalchemy.ext.asyncio import async_sessionmaker
from app.database import engine, Base  # Абсолютный импорт
from app.models import User, Attendance, Reason
from app.enums import ValidationTypeEnum, ReasonNameEnum, StatusEnum
import asyncio
from datetime import datetime
from uuid import uuid4

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with async_session() as session:
        # Добавляем старосту
        starosta = User(
            id="starosta123-4567-89ab-cdef-0123456789ab",
            is_teacher=False,
            keyclockid="starosta_key_123",
        )
        session.add(starosta)

        # Добавляем пример записи посещаемости для старосты
        attendance = Attendance(
            id=str(uuid4()),
            attendance=True,
            validation_type=ValidationTypeEnum.MANUAL,
            lessonid="math101",
            user_id=starosta.id,
        )
        session.add(attendance)

        # Добавляем пример причины (опционально)
        reason = Reason(
            id=str(uuid4()),
            doc_url=None,
            comment="Болезнь",
            reason_name=ReasonNameEnum.ILLNESS,
            status=StatusEnum.ACCEPTED,
        )
        session.add(reason)
        attendance.reason_id = reason.id  # Связываем причину с посещаемостью

        await session.commit()

if __name__ == "__main__":
    asyncio.run(seed_data())