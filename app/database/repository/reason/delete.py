from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

from app.database.models import Reason


class DeleteReasonRepo:
    @staticmethod
    async def delete_reason(
        session: AsyncSession,
        reason_id: UUID
    ) -> None:
        """
        Удаляет запись Reason по её UUID.
        При отсутствии записи бросает NoResultFound.
        """
        # 1. Пытаемся загрузить объект
        reason: Reason | None = await session.get(Reason, reason_id)
        if reason is None:
            raise NoResultFound(f"Reason with id={reason_id} not found")

        # 2. Удаляем и коммитим
        await session.delete(reason)
        await session.commit()

        return None
