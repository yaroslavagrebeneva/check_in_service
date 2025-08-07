from typing import Sequence

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from fastapi import HTTPException
from datetime import datetime
import uuid
from uuid import UUID   

from app.database.models import Reason, Attendance
from app.database.enums import ReasonNameEnum, StatusEnum, ValidationTypeEnum
from app.database.schemas.reason_schemas import ReasonCreate


class PostRepository:
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

    # Добавление причины пропуска.
    @staticmethod
    async def create_reason(
        db: AsyncSession,
        attendance_id: UUID,
        lessonid: str,
        reason_data: ReasonCreate
    ) -> Reason:
        result = await db.execute(
            select(Attendance).where(Attendance.id == attendance_id)
        )
        attendance = result.scalars().first()

        if not attendance:
            raise HTTPException(status_code=404, detail="Attendance not found")

        if attendance.reason_id:
            raise HTTPException(status_code=400, detail="Reason already exists for this attendance")

        new_reason = Reason(
            id=uuid.uuid4(),
            reason_name=reason_data.reason_name,
            status=reason_data.status or StatusEnum.PENDING,
            doc_url=reason_data.doc_url,
            comment=reason_data.comment,
        )
        db.add(new_reason)

        attendance.reason = new_reason

        await db.commit()
        await db.refresh(new_reason)
        return new_reason

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

    @staticmethod
    def parse_qr_code(qr_code: str) -> str:
        # 🔧 Заглушка: просто возвращает qr_code как lessonid
        return qr_code

