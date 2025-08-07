from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

from app.database.database import get_async_session
from app.utils.keycloak_utils import get_current_user
from app.database.schemas.reason_schemas import ReasonCreate, ReasonRead, ReasonUpdate, ReasonStatusOut
from app.tests.test_reason_repo_service import ReasonService

router = APIRouter(prefix="/reasons", tags=["Reasons"])

@router.post("", response_model=ReasonRead, status_code=status.HTTP_201_CREATED)
async def create_reason(
    data: ReasonCreate,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Добавление причины пропуска (только для студентов).
    """
    try:
        reason = await ReasonService.create_reason(
            session=session,
            reason_name=data.reason_name,
            comment=data.comment,
            doc_url=data.doc_url,
        )
        return reason
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create reason: {str(e)}"
        )

@router.patch("/{reason_id}", response_model=ReasonRead)
async def update_reason(
    reason_id: UUID,
    reason_data: ReasonUpdate,
    session: AsyncSession = Depends(get_async_session),
):
    """
    Обновление причины пропуска по ID.
    Разрешённые поля для обновления: reason_name, status, comment, doc_url.
    """
    try:
        updated_reason = await ReasonService.update_reason(
            session,
            reason_id,
            **reason_data.dict(exclude_unset=True),
        )
    except NoResultFound:   
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Reason with id={reason_id} not found",
        )
    return updated_reason

@router.get("/{reason_id}/status", response_model=ReasonStatusOut)
async def get_reason_status(
    reason_id: UUID,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Получить статус причины пропуска по её ID.
    """
    return await ReasonService.get_reason_status(session, reason_id)


@router.get("/{reason_id}", response_model=ReasonRead)
async def get_reason_details(
    reason_id: UUID,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Получить полную информацию о причине пропуска по её ID.
    """
    return await ReasonService.get_reason_details(session, reason_id)


@router.get("/student/{user_id}", response_model=List[ReasonRead])
async def get_student_reasons(
    user_id: UUID,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Получить список причин пропусков по user_id (тестовый эндпоинт).
    """
    return await ReasonService.get_student_reasons(session, user_id)

 