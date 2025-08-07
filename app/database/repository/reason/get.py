from typing import Optional, Sequence
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.models import Attendance, Reason
from app.database.enums import StatusEnum


class GetReasonRepo:
    @staticmethod
    async def get_reason_status(
        session: AsyncSession,
        reason_id: UUID
    ) -> Optional[StatusEnum]:
        """
        Получить текущий статус (StatusEnum) записи Reason по её UUID.

        Args:
            session (AsyncSession): Асинхронная сессия SQLAlchemy.
            reason_id (UUID): Уникальный идентификатор записи Reason.

        Returns:
            Optional[StatusEnum]: Объект StatusEnum, если запись найдена, иначе None.

        Usage:
            status = await GetReasonRepo.get_reason_status(session, some_uuid)
        """
        result = await session.execute(
            select(Reason.status).where(Reason.id == reason_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_reason_details(
        session: AsyncSession,
        reason_id: UUID
    ) -> Optional[Reason]:
        """
        Получить полную запись Reason по её UUID.

        Args:
            session (AsyncSession): Асинхронная сессия SQLAlchemy.
            reason_id (UUID): Уникальный идентификатор записи Reason.

        Returns:
            Optional[Reason]: Экземпляр модели Reason, если запись найдена, иначе None.

        Usage:
            reason = await GetReasonRepo.get_reason_details(session, some_uuid)
        """
        result = await session.execute(
            select(Reason).where(Reason.id == reason_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_students_reason(
        session: AsyncSession,
        user_id: UUID
    ) -> Sequence[Reason]:
        """
        Получить все записи Reason, связанные с посещаемостью одного студента.

        Args:
            session (AsyncSession): Асинхронная сессия SQLAlchemy.
            user_id (UUID): Уникальный идентификатор студента (Attendance.user_id).

        Returns:
            Sequence[Reason]: Список (или другую последовательность) объектов Reason.

        Usage:
            reasons = await GetReasonRepo.get_students_reason(session, user_uuid)
        """
        query = (
            select(Reason)
            .join(Attendance)
            .where(Attendance.user_id == user_id)
        )
        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    # ? Зачем этот репозиторий
    async def get_reason_by_id(
        session: AsyncSession,
        reason_id: UUID
    ) -> Optional[Reason]:
        """
        Получить запись Reason по её UUID.

        Args:
            session (AsyncSession): Асинхронная сессия SQLAlchemy.
            reason_id (UUID): Уникальный идентификатор записи Reason.

        Returns:
            Optional[Reason]: Первый найденный объект Reason или None, если не найден.

        Usage:
            reason = await GetReasonRepo.get_reason_by_id(session, some_uuid)
        """
        stmt = select(Reason).where(Reason.id == reason_id)
        result = await session.execute(stmt)
        return result.scalars().first()
    
