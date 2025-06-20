from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
import pytz

from .models import Attendance
from .schemas import AttendanceRead
from .database import get_async_session

router = APIRouter()
timezone = pytz.timezone("Europe/Moscow")

@router.get("/attendances/", response_model=list[AttendanceRead], tags=["Attendance"], summary="Get attendance list with filters")
async def read_attendances(
    session: AsyncSession = Depends(get_async_session),
    start_date: str = None,
    end_date: str = None,
    user_id: str = None,
    limit: int = 10,
    offset: int = 0
):
    print(f"Processing /attendances/ with user_id={user_id}, limit={limit}, offset={offset}, start_date={start_date}, end_date={end_date}")  # Отладка
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
        print(f"Found attendances: {attendances}")  # Отладка
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
    print(f"Processing /attendances/history with user_id={user_id}, limit={limit}, offset={offset}")  # Отладка
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
        print(f"Found attendances: {attendances}")  # Отладка
        return list(attendances)

@router.get("/attendances/stats", response_model=dict, tags=["Attendance"], summary="Get attendance statistics")
async def get_attendance_stats(
    session: AsyncSession = Depends(get_async_session),
    user_id: str = None,
    start_date: str = None,
    end_date: str = None
):
    print(f"Processing /attendances/stats with user_id={user_id}, start_date={start_date}, end_date={end_date}")  # Отладка
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

@router.get("/attendances/{attendance_id}", response_model=AttendanceRead, tags=["Attendance"], summary="Get attendance by ID")
async def read_attendance(attendance_id: str, session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Attendance).where(Attendance.id == attendance_id))
    attendance = result.scalar_one_or_none()
    if not attendance:
        raise HTTPException(status_code=404, detail="Attendance not found")
    return attendance