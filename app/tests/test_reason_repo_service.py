from typing import Optional, Any, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound
from fastapi import HTTPException, status

from app.database.repository.reason.post import PostReasonRepo
from app.database.repository.reason.update import UpdateReasonRepo
from app.database.repository.reason.get import GetReasonRepo
from app.database.enums import ReasonNameEnum, StatusEnum
from app.database.models import Reason


class ReasonService:
    # * Post_reason_repo
    @staticmethod
    async def create_reason(
        session: AsyncSession,
        reason_name: ReasonNameEnum,
        comment: Optional[str],
        doc_url: Optional[str],
    ) -> Reason:
        """
        Создание причины пропуска (статус по умолчанию — PENDING).
        """
        return await PostReasonRepo.create_reason(
            session=session,
            reason_name=reason_name,
            comment=comment,
            doc_url=doc_url,
            status=StatusEnum.PENDING
        )
    

    # * Update_reason_repo
    @staticmethod
    async def update_reason(
        session: AsyncSession,
        reason_id: UUID,
        **kwargs: Any,
    ) -> Reason:
        try:
            reason = await UpdateReasonRepo.update_reason(session, reason_id, **kwargs)
        except NoResultFound as e:
            raise e
        return reason
    
    # * Get_reason_repo
    @staticmethod
    async def get_reason_status(session: AsyncSession, reason_id: UUID):
        status_ = await GetReasonRepo.get_reason_status(session, reason_id)
        if status_ is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Reason with id={reason_id} not found"
            )
        return {"reason_id": reason_id, "status": status_}

    @staticmethod
    async def get_reason_details(session: AsyncSession, reason_id: UUID) -> Reason:
        reason = await GetReasonRepo.get_reason_details(session, reason_id)
        if reason is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Reason with id={reason_id} not found"
            )
        return reason

    @staticmethod
    async def get_student_reasons(session: AsyncSession, user_id: UUID) -> List[Reason]:
        # Просто возвращаем список причин (например, все для теста)
        reasons = await GetReasonRepo.get_students_reason(session, user_id)
        return reasons
