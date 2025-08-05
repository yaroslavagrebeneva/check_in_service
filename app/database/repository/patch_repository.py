from uuid import UUID
from datetime import datetime
from sqlalchemy import update, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import NoResultFound

from app.database.models import Reason, Attendance
from app.database.enums import ReasonNameEnum, StatusEnum, ValidationTypeEnum


class PatchRepository:
    # Метод: PATCH
    # Путь: /reasons/{reason_id}
    # Описание: Обновление причины пропуска.
    # Параметры: "reason_name", "doc_url", "comment"
    # Ответ: JSON с обновленной записью { "reason_id", "status", "updated_at"}.
    @staticmethod
    async def update_reason(
        session: AsyncSession,
        reason_id: UUID,
        reason_name: ReasonNameEnum | None = None,
        doc_url: str | None = None,
        comment: str | None = None
    ) -> Reason:
        values = {}

        if reason_name is not None:
            values["reason_name"] = reason_name
        if doc_url is not None:
            values["doc_url"] = doc_url
        if comment is not None:
            values["comment"] = comment
        values["updated_at"] = datetime.utcnow()

        stmt = (
            update(Reason)
            .where(Reason.id == reason_id)
            .values(**values)
            .returning(Reason)
        )

        result = await session.execute(stmt)
        updated_reason = result.scalar_one_or_none()

        if not updated_reason:
            raise NoResultFound(f"Reason with id {reason_id} not found")

        await session.commit()
        return updated_reason

    # Метод: PATCH
    # Путь: /attendance
    # Описание: Обновление статуса посещаемости студента (например, отметка присутствия).
    # Параметры: "student_name", "presence".                                            
    # Ответ: "attendance_status", "timestamp".
    @staticmethod
    async def update_attendance_presence(
        session: AsyncSession,
        user_id: UUID,
        lessonid: str,
        presence: bool
    ) -> dict:
        stmt = (
            update(Attendance)
            .where(Attendance.user_id == user_id, Attendance.lessonid == lessonid)
            .values(
                attendance=presence,
                updated_at=datetime.utcnow()
            )
            .returning(
                Attendance.id,
                Attendance.attendance,
                Attendance.updated_at
            )
        )
        result = await session.execute(stmt)
        updated = result.mappings().first()

        if not updated:
            raise NoResultFound(f"Attendance for user {user_id} and lesson {lessonid} not found")

        await session.commit()
        return dict(updated)

    # Метод: PATCH
    # Путь: /attendance/{student_id}
    # Описание: Обновление статуса посещаемости студента, принятие или отклонение причины отсутствия.
    # Параметры: {  "student_id", "attendance_status", "reason_status", "timestamp"}.
    # Ответ: JSON с массивом объектов {  "student_id", "attendance_status", "reason_status", "timestamp"}.
    @staticmethod
    async def update_attendance_status_by_student(
        session: AsyncSession,
        user_id: UUID,
        lessonid: str,
        attendance_status: bool,
        reason_status: StatusEnum,
        timestamp: datetime
    ) -> dict:
        stmt = (
            update(Attendance)
            .where(Attendance.user_id == user_id, Attendance.lessonid == lessonid)
            .values(
                attendance=attendance_status,
                updated_at=timestamp
            )
            .returning(
                Attendance.id,
                Attendance.user_id,
                Attendance.lessonid,
                Attendance.attendance,
                Attendance.updated_at
            )
        )
        result = await session.execute(stmt)
        attendance_data = result.mappings().first()

        if not attendance_data:
            raise NoResultFound(f"Attendance not found for user {user_id} and lesson {lessonid}")

        # Обновляем статус причины, если привязана
        attendance_id = attendance_data["id"]
        stmt_reason = (
            update(Reason)
            .where(Reason.id == Attendance.reason_id, Attendance.id == attendance_id)
            .values(
                status=reason_status,
                updated_at=timestamp
            )
            .returning(
                Reason.id,
                Reason.status,
                Reason.updated_at
            )
        )
        await session.execute(stmt_reason)
        await session.commit()

        return dict(attendance_data)
