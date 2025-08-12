from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime, date

from sqlalchemy import and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database.enums import ReasonNameEnum
from app.database.models import Attendance, Reason


class GetAttendanceRepo:
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
    # ! Написать
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
    # ! Обсудить
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
    
    # ! Это на страницу отметки, как я поняла
    @staticmethod
    async def get_latest_attendance(
        session: AsyncSession,
        user_id: UUID
    ) -> Optional[Attendance]:
        query = select(Attendance).where(Attendance.user_id == user_id).order_by(Attendance.created_at.desc()).limit(1)
        result = await session.execute(query)
        return result.scalar_one_or_none()
    
    # ! Вот это для статистики 
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
