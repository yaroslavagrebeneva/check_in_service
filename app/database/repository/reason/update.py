from typing import Any
from uuid import UUID
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Reason


class UpdateReasonRepo:
    @staticmethod
    async def update_reason(
            session: AsyncSession,
            reason_id: UUID,
            **kwargs: Any
    ) -> Reason:
        """
        Обновляет поля reason_name, status, comment, doc_url у записи Reason с заданным ID.
        При несуществующем ID бросает NoResultFound.
        """
        # Получаем объект из БД
        reason: Reason | None = await session.get(Reason, reason_id)
        if reason is None:
            raise NoResultFound(f"Reason with id={reason_id} not found")

        # Обновляем только разрешённые поля
        allowed_fields = {"reason_name", "status", "comment", "doc_url"}
        for field, value in kwargs.items():
            if field in allowed_fields:
                setattr(reason, field, value)

        # Тут и так понятно
        session.add(reason)
        await session.commit()
        await session.refresh(reason)

        return reason
