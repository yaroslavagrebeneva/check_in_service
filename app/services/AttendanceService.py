from datetime import datetime, timedelta
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from collections import defaultdict
from datetime import date

from app.database.repository import AttendanceRepository
from app.database.models import Attendance
from app.database.schedule_db import fetch_short_schedule


class AttendanceService:
    # Получение статистики посещений студента (эндп. 3)
    @staticmethod
    async def get_student_stats(
        session: AsyncSession,
        user_id: UUID,
        start_date: datetime = None,
        end_date: datetime = None,
    ) -> dict:
        attendances: list[Attendance] = await AttendanceRepository.get_attendances_by_user(
            session=session,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
        )

        total = len(attendances)
        visited = 0
        missed = 0
        late = 0

        monthly_stats = defaultdict(int)
        prev_month_stats = defaultdict(int)

        for a in attendances:
            month = a.created_at.strftime("%Y-%m")
            monthly_stats[month] += 1

            if a.attendance:
                visited += 1
                if a.lesson and a.created_at > a.lesson.start_time + timedelta(minutes=10):
                    late += 1
            elif a.reason_id is None:
                missed += 1

        current_month = datetime.now().strftime("%Y-%m")
        previous_month = (datetime.now().replace(day=1) - timedelta(days=1)).strftime("%Y-%m")

        def calc_diff(current, previous):
            if previous == 0:
                return "+0%"
            diff = (current - previous) / previous * 100 if previous else 0
            return f"{diff:+.0f}%"

        visited_diff_text = calc_diff(monthly_stats.get(current_month, 0), monthly_stats.get(previous_month, 0))
        missed_diff_text = calc_diff(
            sum(1 for a in attendances if a.created_at.strftime("%Y-%m") == current_month and not a.attendance and a.reason_id is None),
            sum(1 for a in attendances if a.created_at.strftime("%Y-%m") == previous_month and not a.attendance and a.reason_id is None),
        )
        late_diff_text = calc_diff(
            sum(1 for a in attendances if a.created_at.strftime("%Y-%m") == current_month and a.attendance and a.created_at > a.lesson.start_time + timedelta(minutes=10)),
            sum(1 for a in attendances if a.created_at.strftime("%Y-%m") == previous_month and a.attendance and a.created_at > a.lesson.start_time + timedelta(minutes=10)),
        )

        return {
            "total": total,
            "visited": visited,
            "missed": missed,
            "late": late,
            "visited_diff_text": visited_diff_text,
            "missed_diff_text": missed_diff_text,
            "late_diff_text": late_diff_text,
            "monthly_stats": [{"month": k, "count": v} for k, v in sorted(monthly_stats.items())],
        }
    
    # Получение списка пропущенных занятий студента (эндп. 4.1)
    @staticmethod
    async def get_missed_attendance_limit(
        session: AsyncSession,
        user_id: UUID,
        start_date: date,
        end_date: date,
        token: str
    ) -> dict:
        missed_records = await AttendanceRepository.get_missed_attendance_limit(
            session=session,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
        )

        schedule = await fetch_short_schedule(token)

        return {
            "missed_attendance": missed_records,
            "schedule": schedule
        }
    
    # Получение списка пропущенных занятий студента (эндп. 4.2)

