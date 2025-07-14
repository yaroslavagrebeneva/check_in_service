"""API endpoints for user, reason, and attendance management."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import uuid4
from datetime import datetime
import pytz

from app.database.models import User, Reason, Attendance
from app.database.database import get_async_session
from app.database.schemas.UserSchemas import (
    UserCreate, UserRead, UserUpdate
)
from app.database.schemas.ReasonSchemas import (
    ReasonCreate, ReasonRead, ReasonUpdate
)
from app.database.schemas.AttendanceSchemas import (
    AttendanceCreate, AttendanceRead, AttendanceUpdate
)

router = APIRouter()

# Установка часового пояса Москвы (UTC+3)
timezone = pytz.timezone("Europe/Moscow")

# ----------------------------
# User Endpoints
# ----------------------------


@router.post("/users/", response_model=UserRead, tags=["Users"], summary="Create a new user")
async def create_user(user: UserCreate, session: AsyncSession = Depends(get_async_session)):
    """Create a new user.
    
    Args:
        user (UserCreate): User data including ID, teacher status, and Keycloak ID.
    
    Returns:
        UserRead: Created user details.
    
    Raises:
        HTTPException: 400 if user ID is missing.
    """
    if not user.id:
        raise HTTPException(status_code=400, detail="User ID is required")
    async with session as sess:
        db_user = User(**user.model_dump())
        sess.add(db_user)
        await sess.commit()
        await sess.refresh(db_user)
    return db_user


@router.get("/users/{user_id}", response_model=UserRead, tags=["Users"], summary="Get user by ID")
async def read_user(user_id: str, session: AsyncSession = Depends(get_async_session)):
    """Retrieve a user by their unique ID.
    
    Args:
        user_id (str): The ID of the user to retrieve.
    
    Returns:
        UserRead: User details.
    
    Raises:
        HTTPException: 404 if user not found.
    """
    async with session as sess:
        result = await sess.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/users/{user_id}", response_model=UserRead, tags=["Users"], summary="Update user by ID")
async def update_user(user_id: str, user_update: UserUpdate, session: AsyncSession = Depends(get_async_session)):
    """Update an existing user by their ID.
    
    Args:
        user_id (str): The ID of the user to update.
        user_update (UserUpdate): Updated user data.
    
    Returns:
        UserRead: Updated user details.
    
    Raises:
        HTTPException: 404 if user not found.
    """
    async with session as sess:
        result = await sess.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        for key, value in user_update.model_dump(exclude_unset=True).items():
            setattr(user, key, value)
        await sess.commit()
        await sess.refresh(user)
    return user


@router.get("/users/", response_model=list[UserRead], tags=["Users"], summary="Get all users")
async def read_users(
    session: AsyncSession = Depends(get_async_session),
    limit: int = 10,
    offset: int = 0
):
    """Retrieve all users with pagination.
    
    Args:
        limit (int): Maximum number of records to return.
        offset (int): Number of records to skip.
    
    Returns:
        list[UserRead]: List of user details.
    """
    async with session as sess:
        result = await sess.execute(select(User).offset(offset).limit(limit))
        users = result.scalars().all()
    return list(users)

# ----------------------------
# Reason Endpoints
# ----------------------------


@router.post("/reasons/", response_model=ReasonRead, tags=["Reasons"], summary="Create a new reason")
async def create_reason(reason: ReasonCreate, session: AsyncSession = Depends(get_async_session)):
    """Create a new reason for absence.
    
    Args:
        reason (ReasonCreate): Reason data including name and status.
    
    Returns:
        ReasonRead: Created reason details.
    
    Raises:
        HTTPException: 400 if reason name is missing.
    """
    if not reason.reason_name:
        raise HTTPException(status_code=400, detail="Reason name is required")
    async with session as sess:
        db_reason = Reason(**reason.model_dump())
        sess.add(db_reason)
        await sess.commit()
        await sess.refresh(db_reason)
    return db_reason


@router.get("/reasons/{reason_id}", response_model=ReasonRead, tags=["Reasons"], summary="Get reason by ID")
async def read_reason(reason_id: str, session: AsyncSession = Depends(get_async_session)):
    """Retrieve a reason by its unique ID.
    
    Args:
        reason_id (str): The ID of the reason to retrieve.
    
    Returns:
        ReasonRead: Reason details.
    
    Raises:
        HTTPException: 404 if reason not found.
    """
    async with session as sess:
        result = await sess.execute(select(Reason).where(Reason.id == reason_id))
        reason = result.scalar_one_or_none()
        if not reason:
            raise HTTPException(status_code=404, detail="Reason not found")
    return reason


@router.patch("/reasons/{reason_id}", response_model=ReasonRead, tags=["Reasons"], summary="Update reason by ID")
async def update_reason(reason_id: str, reason_update: ReasonUpdate, session: AsyncSession = Depends(get_async_session)):
    """Update an existing reason by its ID.
    
    Args:
        reason_id (str): The ID of the reason to update.
        reason_update (ReasonUpdate): Updated reason data.
    
    Returns:
        ReasonRead: Updated reason details.
    
    Raises:
        HTTPException: 404 if reason not found.
    """
    async with session as sess:
        result = await sess.execute(select(Reason).where(Reason.id == reason_id))
        reason = result.scalar_one_or_none()
        if not reason:
            raise HTTPException(status_code=404, detail="Reason not found")
        for key, value in reason_update.model_dump(exclude_unset=True).items():
            setattr(reason, key, value)
        await sess.commit()
        await sess.refresh(reason)
    return reason


@router.get("/reasons/", response_model=list[ReasonRead], tags=["Reasons"], summary="Get all reasons")
async def read_reasons(
    session: AsyncSession = Depends(get_async_session),
    limit: int = 10,
    offset: int = 0
):
    """Retrieve all reasons with pagination.
    
    Args:
        limit (int): Maximum number of records to return.
        offset (int): Number of records to skip.
    
    Returns:
        list[ReasonRead]: List of reason details.
    """
    async with session as sess:
        result = await sess.execute(select(Reason).offset(offset).limit(limit))
        reasons = result.scalars().all()
    return list(reasons)

# ----------------------------
# Attendance Endpoints
# ----------------------------


@router.post("/attendances/", response_model=AttendanceRead, tags=["Attendance"], summary="Create new attendance record")
async def create_attendance(attendance: AttendanceCreate, session: AsyncSession = Depends(get_async_session)):
    """Create a new attendance record.
    
    Args:
        attendance (AttendanceCreate): Attendance data including user ID and validation type.
    
    Returns:
        AttendanceRead: Created attendance details.
    
    Raises:
        HTTPException: 400 if user ID is missing.
    """
    if not attendance.user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    async with session as sess:
        db_attendance = Attendance(**attendance.model_dump())
        sess.add(db_attendance)
        await sess.commit()
        await sess.refresh(db_attendance)
    return db_attendance


@router.get("/attendances/{attendance_id}", response_model=AttendanceRead, tags=["Attendance"], summary="Get attendance by ID")
async def read_attendance(attendance_id: str, session: AsyncSession = Depends(get_async_session)):
    """Retrieve an attendance record by its unique ID.
    
    Args:
        attendance_id (str): The ID of the attendance to retrieve.
    
    Returns:
        AttendanceRead: Attendance details.
    
    Raises:
        HTTPException: 404 if attendance not found.
    """
    async with session as sess:
        result = await sess.execute(select(Attendance).where(Attendance.id == attendance_id))
        attendance = result.scalar_one_or_none()
        if not attendance:
            raise HTTPException(status_code=404, detail="Attendance not found")
    return attendance


@router.patch("/attendances/{attendance_id}", response_model=AttendanceRead, tags=["Attendance"], summary="Update attendance by ID")
async def update_attendance(attendance_id: str, attendance_update: AttendanceUpdate, session: AsyncSession = Depends(get_async_session)):
    """Update an existing attendance record by its ID.
    
    Args:
        attendance_id (str): The ID of the attendance to update.
        attendance_update (AttendanceUpdate): Updated attendance data.
    
    Returns:
        AttendanceRead: Updated attendance details.
    
    Raises:
        HTTPException: 404 if attendance not found.
    """
    async with session as sess:
        result = await sess.execute(select(Attendance).where(Attendance.id == attendance_id))
        attendance = result.scalar_one_or_none()
        if not attendance:
            raise HTTPException(status_code=404, detail="Attendance not found")
        for key, value in attendance_update.model_dump(exclude_unset=True).items():
            setattr(attendance, key, value)
        await sess.commit()
        await sess.refresh(attendance)
    return attendance


@router.get("/attendances/", response_model=list[AttendanceRead], tags=["Attendance"], summary="Get all attendance records")
async def read_attendances(
    session: AsyncSession = Depends(get_async_session),
    limit: int = 10,
    offset: int = 0,
    start_date: str = None,
    end_date: str = None
):
    """Retrieve all attendance records with pagination and date filtering.
    
    Args:
        limit (int): Maximum number of records to return.
        offset (int): Number of records to skip.
        start_date (str): Start date for filtering (YYYY-MM-DD).
        end_date (str): End date for filtering (YYYY-MM-DD).
    
    Returns:
        list[AttendanceRead]: List of attendance details.
    """
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
    async with session as sess:
        result = await sess.execute(query.offset(offset).limit(limit))
        attendances = result.scalars().all()
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
    """Retrieve attendance history with filtering.
    
    Args:
        start_date (str): Start date for filtering (YYYY-MM-DD).
        end_date (str): End date for filtering (YYYY-MM-DD).
        user_id (str): User ID to filter by.
        limit (int): Maximum number of records to return.
        offset (int): Number of records to skip.
    
    Returns:
        list[AttendanceRead]: List of attendance history.
    """
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
    return list(attendances)


@router.get("/attendances/statistics", response_model=dict, tags=["Attendance"], summary="Get attendance statistics")
async def read_attendance_statistics(
    session: AsyncSession = Depends(get_async_session),
    user_id: str = None,
    group_id: str = None,
    start_date: str = None,
    end_date: str = None
):
    """Retrieve attendance statistics.
    
    Args:
        user_id (str): User ID to filter by.
        group_id (str): Group ID to filter by (future feature).
        start_date (str): Start date for filtering (YYYY-MM-DD).
        end_date (str): End date for filtering (YYYY-MM-DD).
    
    Returns:
        dict: Statistics (e.g., total, attended, missed).
    """
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
    return {"total": total, "attended": attended, "missed": missed}


@router.post("/attendances/check", response_model=AttendanceRead, tags=["Attendance"], summary="Check attendance via QR code")
async def check_attendance(qr_code: dict, session: AsyncSession = Depends(get_async_session)):
    """Check attendance using a QR code.
    
    Args:
        qr_code (dict): QR code data (e.g., {'user_id': '1', 'lessonid': '3'}).
    
    Returns:
        AttendanceRead: Created or updated attendance record.
    
    Raises:
        HTTPException: 400 if QR code data is invalid.
    """
    if not qr_code.get("user_id") or not qr_code.get("lessonid"):
        raise HTTPException(status_code=400, detail="User ID and lesson ID are required")
    user_id = qr_code["user_id"]
    lessonid = qr_code["lessonid"]
    async with session as sess:
        result = await sess.execute(select(Attendance).where(Attendance.user_id == user_id, Attendance.lessonid == lessonid))
        attendance = result.scalar_one_or_none()
        if attendance:
            attendance.attendance = True
            await sess.commit()
            await sess.refresh(attendance)
            return attendance
        new_attendance = Attendance(id=str(uuid4()), user_id=user_id, lessonid=lessonid, attendance=True, validation_type="QR")
        sess.add(new_attendance)
        await sess.commit()
        await sess.refresh(new_attendance)
    return new_attendance

#
# @router.get("/attendances/group/{group_id}", response_model=list[AttendanceRead], tags=["Attendance"], summary="Get group attendance with filtering")
# async def get_group_attendance(
#     group_id: str,
#     session: AsyncSession = Depends(get_async_session),
#     start_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD"),
#     end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD"),
# ):
#     """Retrieve attendance records for a specific group, optionally filtered by date range."""
#     query = select(Attendance).join(User).where(User.group_id == group_id)
#
#     if start_date:
#         try:
#             start = timezone.localize(datetime.strptime(start_date, "%Y-%m-%d")).replace(tzinfo=None)
#             query = query.where(Attendance.created_at >= start)
#         except ValueError:
#             raise HTTPException(status_code=400, detail="Invalid start date format")
#     if end_date:
#         try:
#             end = timezone.localize(datetime.strptime(end_date, "%Y-%m-%d")).replace(tzinfo=None)
#             query = query.where(Attendance.created_at <= end)
#         except ValueError:
#             raise HTTPException(status_code=400, detail="Invalid end date format")
#
#     async with session as sess:
#         result = await sess.execute(query)
#         records = result.scalars().all()
#     return records
#
# # ----------------------------
# # New: Calendar Data Endpoint
# # ----------------------------
#
#
# @router.get("/calendar/group/{group_id}", tags=["Calendar"], summary="Get calendar summary for group")
# async def get_calendar_data(
#     group_id: str,
#     session: AsyncSession = Depends(get_async_session),
#     month: Optional[int] = Query(None, ge=1, le=12),
#     year: Optional[int] = Query(None, ge=2000)
# ):
#     """Return summary of absences per day for calendar display (count per day)."""
#     query = select(Attendance.created_at).join(User).where(User.group_id == group_id)
#
#     if month and year:
#         start = datetime(year, month, 1)
#         if month == 12:
#             end = datetime(year + 1, 1, 1)
#         else:
#             end = datetime(year, month + 1, 1)
#         query = query.where(Attendance.created_at.between(start, end))
#
#     async with session as sess:
#         result = await sess.execute(query)
#         records = result.scalars().all()
#
#     calendar_data = {}
#     for date in records:
#         day = date.date().isoformat()
#         calendar_data[day] = calendar_data.get(day, 0) + 1
#
#     return calendar_data
