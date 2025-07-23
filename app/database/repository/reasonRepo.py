from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
import uuid

from app.database.models import Reason
from app.database.enums import ReasonNameEnum, StatusEnum


class ReasonRepository:
    @staticmethod
    async def get_by_id(session: AsyncSession, reason_id: uuid.UUID) -> Reason | None:
        result = await session.execute(select(Reason).where(Reason.id == reason_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all(
        session: AsyncSession,
        limit: int = 10,
        offset: int = 0
    ) -> Sequence[Reason]:
        """
        Retrieve a list of Reason instances with pagination.
        """
        result = await session.execute(
            select(Reason)
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def create(
        session: AsyncSession,
        reason_name: ReasonNameEnum,
        status: StatusEnum,
        doc_url: str | None = None,
        comment: str | None = None
    ) -> Reason:
        new_reason = Reason(
            reason_name=reason_name,
            status=status,
            doc_url=doc_url,
            comment=comment
        )
        session.add(new_reason)
        await session.commit()
        await session.refresh(new_reason)
        return new_reason

    @staticmethod
    async def delete(session: AsyncSession, reason_id: uuid.UUID) -> None:
        await session.execute(delete(Reason).where(Reason.id == reason_id))
        await session.commit()
