from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete, and_
from sqlalchemy.orm import selectinload
from uuid import UUID
from datetime import datetime, date
from typing import List, Optional

from app.database.models import Attendance, Reason
from app.database.schemas.AttendanceSchemas import AttendanceOut, MissedAttendanceOut
from app.database.enums import ValidationTypeEnum
# from app.database.schedule_db import 

class AttendanceRepository:
    @staticmethod
    async def get_by_id(session: AsyncSession, attendance_id: UUID) -> Attendance | None:
        result = await session.execute(select(Attendance).where(Attendance.id == attendance_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def create(
        session: AsyncSession,
        attendance: bool,
        validation_type: ValidationTypeEnum,
        lessonid: str,
        user_id: str,
        reason_id: str | None = None
    ) -> Attendance:
        new_attendance = Attendance(
            attendance=attendance,
            validation_type=validation_type,
            lessonid=lessonid,
            user_id=user_id,
            reason_id=reason_id
        )
        session.add(new_attendance)
        await session.commit()
        await session.refresh(new_attendance)
        return new_attendance

    @staticmethod
    async def delete(session: AsyncSession, attendance_id: str) -> None:
        await session.execute(delete(Attendance).where(Attendance.id == attendance_id))
        await session.commit()
    
    # Регистрация присутствия студента (чек-ин) (эндп. 2)
    # @staticmethod
    # async def get_latest_attendance(session: AsyncSession, user_id: UUID) -> Attendance | None:
    #     result = await session.execute(
    #         select(Attendance)
    #         .where(Attendance.user_id == user_id)
    #         .order_by(Attendance.created_at.desc())
    #         .limit(1)
    #     )
    #     return result.scalar_one_or_none()
    
    # Получение статистики посещений студента (эндп. 3)
    @staticmethod
    async def get_student_attendance(
        session: AsyncSession,
        user_id: UUID,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> list[Attendance]:
        query = select(Attendance).where(Attendance.user_id == user_id)

        if start_date:
            query = query.where(Attendance.created_at >= start_date)
        if end_date:
            query = query.where(Attendance.created_at <= end_date)

        result = await session.execute(query)
        return result.scalars().all()
    
    # Получение списка пропущенных занятий студента (эндп. 4.1)
    @staticmethod
    async def get_missed_attendance_limit(
        session: AsyncSession,
        user_id: UUID,
        start_date: date,
        end_date: date,
    ) -> List[MissedAttendanceOut]:
        stmt = (
            select(Attendance)
            .options(selectinload(Attendance.reason))  # подтягиваем причину
            .where(
                and_(
                    Attendance.user_id == user_id,
                    Attendance.attendance == False,
                    Attendance.date >= start_date,
                    Attendance.date <= end_date,
                )
            )
            .limit(3)
        )
        result = await session.execute(stmt)
        records = result.scalars().all()    
        return [MissedAttendanceOut.from_orm(r) for r in records]
    
    # Получение списка пропущенных занятий студента (эндп. 4.2)
    @staticmethod
    async def get_missed_attendance(
        session: AsyncSession,
        user_id: UUID,
        start_date: date,
        end_date: date,
    ) -> List[MissedAttendanceOut]:
        stmt = (
            select(Attendance)
            .options(selectinload(Attendance.reason))  # подтягиваем причину
            .where(
                and_(
                    Attendance.user_id == user_id,
                    Attendance.attendance == False,
                    Attendance.date >= start_date,
                    Attendance.date <= end_date,
                )
            )
            .limit(3)
        )
        result = await session.execute(stmt)
        records = result.scalars().all()    
        return [MissedAttendanceOut.from_orm(r) for r in records]



