from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from uuid import uuid4

from app.database.models import Attendance
from app.database.enums import ValidationTypeEnum


class AttendanceRepository:
    @staticmethod
    async def get_by_id(session: AsyncSession, attendance_id: str) -> Attendance | None:
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
            id=str(uuid4()),
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
