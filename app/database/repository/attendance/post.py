from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from fastapi import HTTPException
from datetime import datetime
import uuid
from uuid import UUID

from app.database.models import Reason, Attendance
from app.database.enums import ReasonNameEnum, StatusEnum, ValidationTypeEnum


class PostAttendanceRepo:
    # ! Сюда или нет?
    # ? Сгенерировать QR-код для пары

    # Регистрация присутствия студента старостой.
    @staticmethod
    async def manual_checkin(
            db: AsyncSession,
            user_id: UUID,
            lessonid: str,
            timestamp: datetime
    ) -> Attendance:
        result = await db.execute(
            select(Attendance).where(
                Attendance.user_id == user_id,
                Attendance.lessonid == lessonid
            )
        )
        existing = result.scalars().first()
        if existing:
            raise HTTPException(status_code=409, detail="Attendance already recorded")

        new_attendance = Attendance(
            id=uuid.uuid4(),
            user_id=user_id,
            lessonid=lessonid,
            attendance=True,
            validation_type=ValidationTypeEnum.MANUAL,
            created_at=timestamp,
        )
        db.add(new_attendance)
        await db.commit()
        await db.refresh(new_attendance)
        return new_attendance

    # Регистрация присутствия студента через сканирование QR-кода.
    @staticmethod
    async def qr_checkin(
            db: AsyncSession,
            user_id: UUID,
            lessonid: str,
            qr_code: str,
            timestamp: datetime
    ) -> Attendance:
        # Заглушка: извлечение lessonid из qr_code
        # lessonid = AttendanceRepository.parse_qr_code(qr_code)

        result = await db.execute(
            select(Attendance).where(
                Attendance.user_id == user_id,
                Attendance.lessonid == lessonid
            )
        )
        existing = result.scalars().first()
        if existing:
            raise HTTPException(status_code=409, detail="Attendance already recorded")

        new_attendance = Attendance(
            id=uuid.uuid4(),
            user_id=user_id,
            lessonid=lessonid,
            attendance=True,
            validation_type=ValidationTypeEnum.QR,
            created_at=timestamp
        )
        db.add(new_attendance)
        await db.commit()
        await db.refresh(new_attendance)
        return new_attendance
