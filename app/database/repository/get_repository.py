# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from sqlalchemy import delete, and_
# from sqlalchemy.orm import selectinload
# from uuid import UUID
# from datetime import datetime, date
# from typing import List, Optional

# from app.database.models import Attendance, Reason
# from app.database.schemas.AttendanceSchemas import AttendanceOut, MissedAttendanceOut
# from app.database.enums import ValidationTypeEnum
# # from app.database.schedule_db import 

# class GetRepository:
#     @staticmethod
#     async def get_by_id(session: AsyncSession, attendance_id: UUID) -> Attendance | None:
#         result = await session.execute(select(Attendance).where(Attendance.id == attendance_id))
#         return result.scalar_one_or_none()

#     @staticmethod
#     async def create(
#         session: AsyncSession,
#         attendance: bool,
#         validation_type: ValidationTypeEnum,
#         lessonid: str,
#         user_id: str,
#         reason_id: str | None = None
#     ) -> Attendance:
#         new_attendance = Attendance(
#             attendance=attendance,
#             validation_type=validation_type,
#             lessonid=lessonid,
#             user_id=user_id,
#             reason_id=reason_id
#         )
#         session.add(new_attendance)
#         await session.commit()
#         await session.refresh(new_attendance)
#         return new_attendance

#     @staticmethod
#     async def delete(session: AsyncSession, attendance_id: str) -> None:
#         await session.execute(delete(Attendance).where(Attendance.id == attendance_id))
#         await session.commit()
    
#     # Регистрация присутствия студента (чек-ин) (эндп. 2)
#     # @staticmethod
#     # async def get_latest_attendance(session: AsyncSession, user_id: UUID) -> Attendance | None:
#     #     result = await session.execute(
#     #         select(Attendance)
#     #         .where(Attendance.user_id == user_id)
#     #         .order_by(Attendance.created_at.desc())
#     #         .limit(1)
#     #     )
#     #     return result.scalar_one_or_none()
    
#     # Получение статистики посещений студента (эндп. 3)
#     @staticmethod
#     async def get_student_attendance(
#         session: AsyncSession,
#         user_id: UUID,
#         start_date: Optional[datetime] = None,
#         end_date: Optional[datetime] = None
#     ) -> list[Attendance]:
#         query = select(Attendance).where(Attendance.user_id == user_id)

#         if start_date:
#             query = query.where(Attendance.created_at >= start_date)
#         if end_date:
#             query = query.where(Attendance.created_at <= end_date)

#         result = await session.execute(query)
#         return result.scalars().all()
    
#     # Получение списка пропущенных занятий студента (эндп. 4.1)
#     @staticmethod
#     async def get_missed_attendance_limit(
#         session: AsyncSession,
#         user_id: UUID,
#         start_date: date,
#         end_date: date,
#     ) -> List[MissedAttendanceOut]:
#         stmt = (
#             select(Attendance)
#             .options(selectinload(Attendance.reason))  # подтягиваем причину
#             .where(
#                 and_(
#                     Attendance.user_id == user_id,
#                     Attendance.attendance == False,
#                     Attendance.date >= start_date,
#                     Attendance.date <= end_date,
#                 )
#             )
#             .limit(3)
#         )
#         result = await session.execute(stmt)
#         records = result.scalars().all()    
#         return [MissedAttendanceOut.from_orm(r) for r in records]
    
#     # ! Получение списка пропущенных занятий студента (эндп. 4.2)
#     @staticmethod
#     async def get_missed_attendance(
#         session: AsyncSession,
#         user_id: UUID,
#         start_date: date,
#         end_date: date,
#     ) -> List[MissedAttendanceOut]:
#         stmt = (
#             select(Attendance)
#             .options(selectinload(Attendance.reason))  # подтягиваем причину
#             .where(
#                 and_(
#                     Attendance.user_id == user_id,
#                     Attendance.attendance == False,
#                     Attendance.date >= start_date,
#                     Attendance.date <= end_date,
#                 )
#             )
#             .limit(3)
#         )
#         result = await session.execute(stmt)
#         records = result.scalars().all()    
#         return [MissedAttendanceOut.from_orm(r) for r in records]
    
#     # Получение отчета
#     @staticmethod
#     async def fetch_attendances_with_reasons(
#         session: AsyncSession,
#         user_id: UUID,
#         start: datetime,
#         end: datetime
#     ) -> List[Attendance]:
#         result = await session.execute(
#             select(Attendance)
#             .outerjoin(Reason)
#             .where(
#                 Attendance.user_id == user_id,
#                 Attendance.created_at.between(start, end)
#             )
#             .options(selectinload(Attendance.reason))
#         )
#         return result.scalars().all()

    
# Метод: GET
# Путь: /attendance/checkin
# Описание: Регистрация присутствия студента (чек-ин).
# Ответ: JSON с полем { "status", "subject", "teacher", "datetime"}


# Метод: GET
# Путь: /attendance/stats
# Описание: Получение статистики посещений студента.
# Параметры: start_date, end_date (опционально)
# Ответ: JSON с полями "total", "late", "missed", "visited", "visited_diff_text", "late_diff_text", "missed_diff_text", "monthly_stats":[ { "month", "count"}, { "month", "count"}, … ]


# Метод: GET
# Путь: /attendance/missed
# Описание: Получение списка пропущенных занятий.
# Параметры: start_date, end_date, status (опционально)
# Ответ: JSON с массивом объектов {от Сейдали бд}


# Метод: GET
# Путь: /reasons/{reason_id}/status
# Описание: Проверка статуса причины пропуска.
# Ответ: JSON {"reason_id", "status"}


# Метод: GET
# Путь: /reasons/{reason_id}
# Описание: Получение подробной информации о причине пропуска по её ID.
# Параметры: reason_id
# Ответ: JSON с полями "id", "reason_name", "status", "created_at", "doc_url", "comment".


# Метод: GET
# Путь: /dean-office/visits
# Описание:  Получение сообщения или записи о посещении деканата.
# Ответ: JSON "visit_date", "message".


# Метод: GET
# Путь: /group/attendance-stats
# Описание: Получение общей статистики посещений группы.
# Параметры: start_date, end_date (опционально).
# Ответ: JSON с полями {"group": integer, "total": integer, "missed_percent": float, "missed_diff_text": float, "visited_percent": float, "visited_diff_text": float, "monthly_stats": {"Jan": integer, "Feb": integer … }}


# Метод: GET
# Путь: /students-attendance
# Описание: Получение списка посещений студентов группы.
# Параметры: опционально start_date, end_date, status, subject .
# Ответ: JSON с массивом объектов [ "student_name", "lesson_type", "subject", "presence", "reason" ]


# Метод: GET
# Путь: /schedule
# Описание: Получение расписания занятий.
# Параметры: date (опционально).
# Ответ: JSON с массивом объектов "day": "27 мая", "schedule": ["lesson_type", "time", "subject", "room", "teacher"].


# Метод: GET
# Путь: /group/attendance-stats
# Описание: Получение общей статистики посещений группы.
# Параметры: None (данные о группе извлекаются из токена).
# Ответ: JSON с полями ["monthly_stats": {"Jan": integer, "Feb": integer…]


# Метод: GET
# Путь: /students-attendance
# Описание: Получение списка посещений студентов группы.
# Параметры: опционально start_date, end_date, status, group, reason_name.
# Ответ: JSON с массивом объектов [ "student_name", "lesson_type", "subject", "datetime",  "presence", "reason_status", "validation_type" ].


# Метод: GET
# Путь: /students-reason
# Описание: Получение причины пропуска от студента.
# Параметры: student_id (опционально).
# Ответ: JSON с массивом объектов [ "student_id", "timestamp", "reason_name", "doc_url" , "reason_status", "comment"].


# Метод: GET
# Путь: /schedule
# Описание: Получение расписания занятий для проверки посещения.
# Ответ: JSON с массивом объектов [ "timetsamp", "lesson_type", "time", "subject", "room", "group"].


# Метод: GET
# Путь: /group/attendance-stats
# Описание: Получение общей статистики посещений группы.
# Параметры: None (данные о группе извлекаются из токена).
# Ответ: JSON с полями ["monthly_stats": {"Jan": integer, "Feb": integer…]


# Метод: GET
# Путь: /critital-attendance
# Описание: Получение студентов с критической посещаемостью в группе.
# Ответ: JSON с полями "student_id", "student_name", "department",  "group", "attendance_percent".


# Метод: GET
# Путь: /references
# Описание: Получение списка справок.
# Параметры: опционально start_date, end_date.
# Ответ: JSON с полем  [ "student_name", "department", "group", "period",  "doc_url", "reason_status", "validation_type" ].


# Метод: GET
# Путь: /reports/preview
# Описание: Предпросмотр отчета о посещаемости перед его генерацией.	
# Параметры: "department", "group", "month".
# Ответ: JSON с полем  [ "month", "group", "all_classes",  "student_names", "all_missed_classes", "all_missed_classes_with_good_reason"].

from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime, date

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import and_, or_

import httpx

from app.database.models import Attendance, Reason
from app.database.enums import ReasonNameEnum, StatusEnum


class ReadRepository:

    @staticmethod
    async def get_reason_status(session: AsyncSession, reason_id: UUID) -> Optional[StatusEnum]:
        result = await session.execute(select(Reason.status).where(Reason.id == reason_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_reason_details(session: AsyncSession, reason_id: UUID) -> Optional[Reason]:
        result = await session.execute(select(Reason).where(Reason.id == reason_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_references(
        session: AsyncSession,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> List[Reason]:
        query = select(Reason).where(Reason.doc_url.isnot(None))
        if start_date:
            query = query.where(Reason.created_at >= start_date)
        if end_date:
            query = query.where(Reason.created_at <= end_date)

        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_students_attendance(
        session: AsyncSession,
        user_ids: List[UUID],  # список user_id студентов для фильтрации
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        status: Optional[bool] = None,
        reason_name: Optional[ReasonNameEnum] = None
    ) -> List[Attendance]:
        query = select(Attendance).options(selectinload(Attendance.reason)).where(Attendance.user_id.in_(user_ids))

        if start_date:
            query = query.where(Attendance.created_at >= start_date)
        if end_date:
            query = query.where(Attendance.created_at <= end_date)
        if status is not None:
            query = query.where(Attendance.attendance == status)
        if reason_name:
            query = query.join(Reason).where(Reason.reason_name == reason_name)

        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_students_reason(
        session: AsyncSession,
        user_id: UUID
    ) -> List[Reason]:
        query = select(Reason).join(Attendance).where(Attendance.user_id == user_id)
        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_critical_attendance(
        session: AsyncSession,
        attendance_threshold_percent: float = 50.0
    ) -> List[Dict[str, Any]]:
        """
        Получить студентов с посещаемостью ниже порога (например, 50%)
        Пока заглушка — надо реализовать агрегацию
        """
        # TODO: сделать агрегацию и фильтрацию
        return []

    @staticmethod
    async def get_report_preview(
        session: AsyncSession,
        month: int,
        year: int
    ) -> Dict[str, Any]:
        from calendar import monthrange
        start = datetime(year, month, 1)
        end = datetime(year, month, monthrange(year, month)[1], 23, 59, 59)
        query = select(Attendance).where(Attendance.created_at.between(start, end)).options(selectinload(Attendance.reason))
        result = await session.execute(query)
        attendances = result.scalars().all()

        total_classes = len(attendances)
        all_missed = sum(1 for a in attendances if not a.attendance)
        all_missed_good_reason = sum(1 for a in attendances if not a.attendance and a.reason and a.reason.reason_name == ReasonNameEnum.GOOD_REASON)

        return {
            "month": month,
            "year": year,
            "all_classes": total_classes,
            "all_missed_classes": all_missed,
            "all_missed_classes_with_good_reason": all_missed_good_reason,
            "student_names": []  # сюда можно добавить логику по именам студентов
        }

    @staticmethod
    async def get_latest_attendance(
        session: AsyncSession,
        user_id: UUID
    ) -> Optional[Attendance]:
        query = select(Attendance).where(Attendance.user_id == user_id).order_by(Attendance.created_at.desc()).limit(1)
        result = await session.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_attendance_stats(
        session: AsyncSession,
        user_id: UUID,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Attendance]:
        query = select(Attendance).where(Attendance.user_id == user_id)
        if start_date:
            query = query.where(Attendance.created_at >= start_date)
        if end_date:
            query = query.where(Attendance.created_at <= end_date)
        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_missed_attendance(
        session: AsyncSession,
        user_id: UUID,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> List[Attendance]:
        query = select(Attendance).where(
            and_(
                Attendance.user_id == user_id,
                Attendance.attendance == False,
            )
        )
        if start_date:
            query = query.where(Attendance.created_at >= start_date)
        if end_date:
            query = query.where(Attendance.created_at <= end_date)
        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_schedule(
        token: str
    ) -> dict:
        url = "https://backend.univibe.ru/api/group-schedules"
        headers = {"Authorization": f"Bearer {token}"}
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()

        teacher = data.get("teacher")
        teacher_name = None
        if teacher:
            parts = [teacher.get(k) for k in ("first_name", "last_name", "middle_name") if teacher.get(k)]
            teacher_name = " ".join(parts) if parts else None

        lessons = data.get("lessons") or []
        lesson_name = lessons[0].get("description") if lessons else None

        return {
            "startTime": data.get("startTime"),
            "endTime": data.get("endTime"),
            "scheduleDate": data.get("scheduleDate"),
            "teacherName": teacher_name,
            "lessonName": lesson_name,
        }

    @staticmethod
    async def get_group_attendance_stats(
        session: AsyncSession,
        group: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        query = select(Attendance)
        if start_date:
            query = query.where(Attendance.created_at >= start_date)
        if end_date:
            query = query.where(Attendance.created_at <= end_date)

        result = await session.execute(query)
        records = result.scalars().all()

        total = len(records)
        visited = sum(1 for r in records if r.attendance)
        missed = total - visited

        monthly_stats = {}
        for r in records:
            month = r.created_at.strftime("%b")
            monthly_stats[month] = monthly_stats.get(month, 0) + 1

        return {
            "group": group,
            "total": total,
            "missed_percent": round((missed / total) * 100, 2) if total else 0,
            "visited_percent": round((visited / total) * 100, 2) if total else 0,
            "monthly_stats": monthly_stats,
        }
