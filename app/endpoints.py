from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
import pytz
from uuid import uuid4

from .models import Attendance, User
from .schemas import AttendanceRead, AttendanceBase, AttendanceStats
from .database import get_async_session
from .enums import ValidationTypeEnum

router = APIRouter()
timezone = pytz.timezone("Europe/Moscow")

async def get_current_user(session: AsyncSession = Depends(get_async_session), user_id: str = None):
    if not user_id:
        raise HTTPException(status_code=403, detail="User ID is required")
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_teacher:
        raise HTTPException(status_code=403, detail="Unauthorized or not a teacher")
    return user

@router.get("/attendances/", response_model=list[AttendanceRead], tags=["Attendance"], summary="Get attendance list with filters")
async def read_attendances(
    session: AsyncSession = Depends(get_async_session),
    start_date: str = None,
    end_date: str = None,
    user_id: str = None,
    limit: int = 10,
    offset: int = 0
):
    print(f"Processing /attendances/ with user_id={user_id}, limit={limit}, offset={offset}, start_date={start_date}, end_date={end_date}")
    query = select(Attendance)
    if start_date and end_date:
        try:
            start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
            end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at.between(start, end))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    elif start_date:
        try:
            start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at >= start)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    elif end_date:
        try:
            end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at <= end)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    if user_id:
        query = query.where(Attendance.user_id == user_id)
    async with session as sess:
        result = await sess.execute(query.offset(offset).limit(limit))
        attendances = result.scalars().all()
        print(f"Found attendances: {attendances}")
        return list(attendances)

@router.get("/attendances/history", response_model=list[AttendanceRead], tags=["Attendance"], summary="Get attendance history")
async def read_attendance_history(
    session: AsyncSession = Depends(get_async_session),
    start_date: str = None,
    end_date: str = None,
    user_id: str = None,
    limit: int = 10,
    offset: int = 0
):
    print(f"Processing /attendances/history with user_id={user_id}, limit={limit}, offset={offset}")
    query = select(Attendance)
    if start_date and end_date:
        try:
            start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
            end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at.between(start, end))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    elif start_date:
        try:
            start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at >= start)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    elif end_date:
        try:
            end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at <= end)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    if user_id:
        query = query.where(Attendance.user_id == user_id)
    async with session as sess:
        result = await sess.execute(query.offset(offset).limit(limit))
        attendances = result.scalars().all()
        print(f"Found attendances: {attendances}")
        return list(attendances)

@router.get("/attendances/stats", response_model=AttendanceStats, tags=["Attendance"], summary="Get personal attendance statistics")
async def get_attendance_stats(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
    start_date: str = None,
    end_date: str = None
):
    print(f"Processing /attendances/stats with user_id={user.id}, start_date={start_date}, end_date={end_date}")
    query = select(Attendance).where(Attendance.user_id == user.id)
    if start_date and end_date:
        try:
            start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
            end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at.between(start, end))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    elif start_date:
        try:
            start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at >= start)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    elif end_date:
        try:
            end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at <= end)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    async with session as sess:
        result = await sess.execute(query)
        attendances = result.scalars().all()
        total = len(attendances)
        attended = sum(1 for a in attendances if a.attendance)
        missed = total - attended
        percent = (attended / total * 100) if total > 0 else 0
        return {
            "total": total,
            "attended": attended,
            "missed": missed,
            "percent": round(percent, 2)
        }

@router.get("/attendances/group-stats", response_model=AttendanceStats, tags=["Attendance"], summary="Get group attendance statistics")
async def get_group_attendance_stats(
    session: AsyncSession = Depends(get_async_session),
    start_date: str = None,
    end_date: str = None,
    group_id: str = None  # Добавляем параметр для фильтрации по группе
):
    print(f"Processing /attendances/group-stats with start_date={start_date}, end_date={end_date}, group_id={group_id}")
    query = select(Attendance)
    if start_date and end_date:
        try:
            start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
            end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at.between(start, end))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    elif start_date:
        try:
            start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at >= start)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    elif end_date:
        try:
            end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
            query = query.where(Attendance.created_at <= end)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    if group_id:
        # Здесь нужен способ связать lessonid с группой. Пока оставим как есть, улучшим позже
        pass
    async with session as sess:
        result = await sess.execute(query)
        attendances = result.scalars().all()
        total = len(attendances)
        attended = sum(1 for a in attendances if a.attendance)
        missed = total - attended
        percent = (attended / total * 100) if total > 0 else 0
        return {
            "total": total,
            "attended": attended,
            "missed": missed,
            "percent": round(percent, 2)
        }

@router.post("/attendances/", response_model=AttendanceRead, tags=["Attendance"], summary="Create new attendance record")
async def create_attendance(
    attendance: AttendanceBase,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user)
):
    print(f"Processing /attendances/ POST with data={attendance}, user_id={user.id}")
    result = await session.execute(select(User).where(User.id == attendance.user_id))
    target_user = result.scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_attendance = Attendance(
        id=str(uuid4()),
        attendance=attendance.attendance,
        validation_type=attendance.validation_type,
        lessonid=attendance.lessonid,
        created_at=datetime.now(timezone),
        updated_at=datetime.now(timezone),
        user_id=attendance.user_id,
        reason_id=attendance.reason_id
    )
    session.add(new_attendance)
    await session.commit()
    await session.refresh(new_attendance)
    print(f"Created attendance: {new_attendance}")
    return new_attendance

@router.get("/teacher/qr-code", response_model=dict, tags=["Teacher"], summary="Generate QR code for attendance")
async def generate_qr_code(user: User = Depends(get_current_user)):
    # Генерация временного кода (можно улучшить с сохранением в БД)
    code = str(uuid4())[:8]  # Пример: 8-значный код
    return {"code": code, "expires_at": datetime.now(timezone) + timedelta(minutes=5)}

@router.get("/teacher/lesson-students", response_model=list[dict], tags=["Teacher"], summary="Get students for a lesson")
async def get_lesson_students(
    lesson_id: str,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user)
):
    # Мок, так как students не хранятся в БД
    # В реальном случае нужно добавить таблицу students или связать через Attendance
    mock_students = [
        {"id": "student1", "name": "Иван Иванов", "status": "П", "markType": "manual"},
        {"id": "student2", "name": "Мария Петрова", "status": "Н", "markType": "qr"},
    ]
    return mock_students

@router.put("/attendances/{attendance_id}", response_model=AttendanceRead, tags=["Attendance"], summary="Update attendance status")
async def update_attendance(
    attendance_id: str,
    attendance: AttendanceBase,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(get_current_user)
):
    result = await session.execute(select(Attendance).where(Attendance.id == attendance_id))
    existing_attendance = result.scalar_one_or_none()
    if not existing_attendance:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    existing_attendance.attendance = attendance.attendance
    existing_attendance.validation_type = attendance.validation_type
    existing_attendance.lessonid = attendance.lessonid
    existing_attendance.updated_at = datetime.now(timezone)
    existing_attendance.reason_id = attendance.reason_id

    await session.commit()
    await session.refresh(existing_attendance)
    return existing_attendance