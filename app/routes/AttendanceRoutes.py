from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date
from uuid import UUID

from app.services.AttendanceService import AttendanceService
from app.utils.keycloak_utils import get_current_user, require_role
from app.database.database import get_async_session

router = APIRouter(prefix="/attendance", tags=["Attendance"])

# Получение статистики посещений студента (эндп. 3)
@router.get("/stats")
async def get_attendance_stats(
    start_date: datetime = Query(None),
    end_date: datetime = Query(None),
    session: AsyncSession = Depends(get_async_session),
    current_user=Depends(require_role("student", "headman")) # ! какие роли на кейклоке)
    ):
    stats = await AttendanceService.get_student_stats(
        session=session,
        user_id=current_user["sub"],
        start_date=start_date,
        end_date=end_date
    )
    return stats

# Получение списка пропущенных занятий студента (эндп. 4.1)
@router.get("/missed", response_model=dict)
async def get_missed_attendance(
    start_date: date = Query(None),
    end_date: date = Query(None),
    session: AsyncSession = Depends(get_async_session),
    current_user = Depends(require_role("student", "headman")),
    token: str = Depends(get_current_user),
):
    """
    Получение списка пропущенных занятий студента (до 3 записей)
    и короткого расписания группы через внешний API.
    """
    try:
        result = await AttendanceService.get_missed_attendance_limit(
            session=session,
            user_id=current_user.id,
            start_date=start_date,
            end_date=end_date,
            token=token 
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    # Получение списка пропущенных занятий студента (эндп. 4.2)