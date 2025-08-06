from typing import Optional, Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models import Attendance, Reason
from app.database.enums import StatusEnum


class GetReasonRepo:
    @staticmethod
    async def get_reason_status(session: AsyncSession, reason_id: UUID) -> Optional[StatusEnum]:
        result = await session.execute(select(Reason.status).where(Reason.id == reason_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_reason_details(session: AsyncSession, reason_id: UUID) -> Optional[Reason]:
        result = await session.execute(select(Reason).where(Reason.id == reason_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_students_reason(
        session: AsyncSession,
        user_id: UUID
    ) -> Sequence[Reason]:
        query = select(Reason).join(Attendance).where(Attendance.user_id == user_id)
        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_reason_by_id(session: AsyncSession, reason_id: UUID) -> Optional[Reason]:
        """
        Получаем reason по его UUID
        Args:
            session:
            reason_id:

        Returns:
            Возвращает один объект или None
        """
        stmt = select(Reason).where(Reason.id == reason_id)
        result = await session.execute(stmt)
        return result.scalars().first()
