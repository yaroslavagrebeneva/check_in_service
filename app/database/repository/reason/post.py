from typing import Any
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models import Reason


class PostReasonRepo:
    @staticmethod
    async def create_reason(
            session: AsyncSession,
            **kwargs: Any
    ) -> Reason:
        """
        Создаёт новую запись Reason.
        Ожидаемые ключи в kwargs:
          - reason_name: ReasonNameEnum
          - comment:     Optional[str]
          - doc_url:     Optional[str]
        """
        # Фильтруем только разрешённые поля
        allowed_fields = {"reason_name", "comment", "doc_url"}
        data = {k: v for k, v in kwargs.items() if k in allowed_fields}

        # Создаём и сохраняем
        reason = Reason(**data)
        session.add(reason)
        try:
            await session.commit()
        except IntegrityError:
            await session.rollback()
            raise

        return reason
