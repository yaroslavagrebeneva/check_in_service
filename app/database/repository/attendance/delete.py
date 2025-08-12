from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
import uuid
from app.database.models import Reason


class DeleteAttendanceRepo:
    # ! удаляем Reason?) 
    @staticmethod
    async def delete(session: AsyncSession, reason_id: uuid.UUID) -> None:
        await session.execute(delete(Reason).where(Reason.id == reason_id))
        await session.commit()
