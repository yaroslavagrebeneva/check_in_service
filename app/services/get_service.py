from datetime import datetime, timedelta, date
from uuid import UUID
from collections import defaultdict
from typing import List

from fastapi import HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import tempfile
import uuid
import httpx
import io
import os
from subprocess import run

from app.database.repository import get_repository
from app.database.models import Attendance, Reason
from app.database.schedule_db import fetch_short_schedule


class GetService:
    report_cache = {}

    # --------------------------- СТАТИСТИКА ---------------------------

    @staticmethod
    async def get_student_stats(
        session: AsyncSession,
        user_id: UUID,
        start_date: datetime = None,
        end_date: datetime = None,
    ) -> dict:
        attendances: List[Attendance] = await get_repository.get_attendances_by_user(
            session=session,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
        )

        total = len(attendances)
        visited = missed = late = 0
        monthly_stats = defaultdict(int)

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
            diff = (current - previous) / previous * 100
            return f"{diff:+.0f}%"

        visited_diff_text = calc_diff(monthly_stats.get(current_month, 0), monthly_stats.get(previous_month, 0))
        missed_diff_text = calc_diff(
            sum(1 for a in attendances if a.created_at.strftime("%Y-%m") == current_month and not a.attendance and a.reason_id is None),
            sum(1 for a in attendances if a.created_at.strftime("%Y-%m") == previous_month and not a.attendance and a.reason_id is None),
        )
        late_diff_text = calc_diff(
            sum(1 for a in attendances if a.created_at.strftime("%Y-%m") == current_month and a.attendance and a.lesson and a.created_at > a.lesson.start_time + timedelta(minutes=10)),
            sum(1 for a in attendances if a.created_at.strftime("%Y-%m") == previous_month and a.attendance and a.lesson and a.created_at > a.lesson.start_time + timedelta(minutes=10)),
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

    # --------------------------- ПРОПУСКИ ---------------------------

    @staticmethod
    async def get_missed_attendance_limit(
        session: AsyncSession,
        user_id: UUID,
        start_date: date,
        end_date: date,
        token: str
    ) -> dict:
        missed_records = await get_repository.get_missed_attendance_limit(
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

    # --------------------------- ПРИЧИНЫ ---------------------------

    @staticmethod
    async def create_reason(session: AsyncSession, **kwargs) -> Reason:
        return await get_repository.create_reason(session, **kwargs)

    @staticmethod
    async def get_reason_by_id(session: AsyncSession, reason_id: UUID) -> Reason:
        return await get_repository.get_reason_by_id(session, reason_id)

    @staticmethod
    async def get_reason_status(session: AsyncSession, reason_id: UUID) -> dict:
        status = await get_repository.get_reason_status(session, reason_id)
        return {"reason_id": reason_id, "status": status}

    @staticmethod
    async def update_reason(session: AsyncSession, reason_id: UUID, **kwargs) -> Reason:
        return await get_repository.update_reason(session, reason_id, **kwargs)

    @staticmethod
    async def get_dean_visits(session: AsyncSession) -> dict:
        return {"visit_date": "2025-05-20", "message": "Вы были в деканате по вопросу академ. справки."}

    # --------------------------- ОТЧЁТ ---------------------------

    @classmethod
    async def generate_report(cls, db: AsyncSession, group_id: str, start_date: str, end_date: str, user_id: UUID, token: str):
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)

        schedule_data = await cls._get_schedule_data(group_id, token, start_date, end_date)
        if not schedule_data:
            raise HTTPException(status_code=404, detail="Schedule data not found")

        attendances = await get_repository.get_attendances_with_reasons(db, user_id, start, end)

        report_data = {
            "user_id": user_id,
            "group_id": group_id,
            "schedule_dates": schedule_data,
            "attendances": [
                {
                    "date": a.created_at,
                    "attendance": a.attendance,
                    "reason": a.reason.reason_name if a.reason else None,
                    "status": a.reason.status if a.reason else None
                } for a in attendances
            ]
        }

        file_id = str(uuid.uuid4())
        cls.report_cache[file_id] = {
            "data": report_data,
            "expires": datetime.utcnow() + timedelta(hours=1)
        }
        return {"status": "success", "download_url": f"/reports/download/{file_id}"}

    @classmethod
    async def download_report(cls, file_id: str):
        if file_id not in cls.report_cache or cls.report_cache[file_id]["expires"] < datetime.utcnow():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found or expired")

        report_data = cls.report_cache[file_id]["data"]
        latex_content = cls._generate_latex(report_data)

        with tempfile.NamedTemporaryFile(suffix=".tex", delete=False) as tex_file:
            tex_file.write(latex_content.encode())
            tex_file_path = tex_file.name

        try:
            run(["latexmk", "-pdf", tex_file_path], check=True, capture_output=True, text=True)
            pdf_path = tex_file_path.replace(".tex", ".pdf")

            with open(pdf_path, "rb") as f:
                pdf_bytes = f.read()

            for ext in [".tex", ".aux", ".log", ".pdf", ".fls", ".fdb_latexmk"]:
                path = tex_file_path.replace(".tex", ext)
                if os.path.exists(path):
                    os.remove(path)

            return FileResponse(
                io.BytesIO(pdf_bytes),
                media_type="application/pdf",
                filename=f"attendance_report_{report_data['user_id']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
        finally:
            if os.path.exists(tex_file_path):
                os.remove(tex_file_path)

    @staticmethod
    async def _get_schedule_data(group_id: str, token: str, start_date: str, end_date: str):
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        current_date = start
        result = []

        while current_date <= end:
            url = f"https://backend.univibe.ru/api/group-schedules?groupId={group_id}&scheduleDate={current_date.date()}"
            headers = {"Authorization": f"Bearer {token}"}
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.get(url, headers=headers)
                    response.raise_for_status()
                    data = response.json()
                    teacher = data.get("teacher")
                    teacher_name = " ".join([teacher.get(k) for k in ("first_name", "last_name", "middle_name") if teacher.get(k)]) if teacher else None
                    lessons = data.get("lessons") or []
                    lesson_name = lessons[0].get("description") if lessons else None
                    result.append({
                        "startTime": data.get("startTime"),
                        "endTime": data.get("endTime"),
                        "scheduleDate": data.get("scheduleDate"),
                        "teacherName": teacher_name,
                        "lessonName": lesson_name,
                    })
                except httpx.HTTPStatusError:
                    pass
            current_date += timedelta(days=1)
        return result

    @staticmethod
    def _generate_latex(data):
        return r"""
\documentclass[a4paper,12pt]{article}
\usepackage[utf8]{inputenc}
\usepackage[russian]{babel}
\usepackage{array}
\usepackage{geometry}
\geometry{margin=2cm}
\usepackage{longtable}
\usepackage{booktabs}
\usepackage{pgffor}

\begin{document}

\begin{center}
    \textbf{Отчет по посещаемости}
\end{center}

\vspace{0.5cm}

\noindent
\textbf{Месяц:} \hrulefill

\vspace{0.3cm}

\noindent
\textbf{Группа:} \hrulefill

\vspace{0.3cm}

\noindent
\textbf{Общее количество проведенных занятий в месяц:} \hrulefill

\vspace{0.7cm}

\renewcommand{\arraystretch}{1.5}
\begin{tabular}{|p{6cm}|c|c|}
    \hline
    \textbf{ФИО обучающегося} & \textbf{Общее количество пропущенных занятий} & \textbf{Количество пропущенных занятий по уважительной причине} \\
    \hline
    % цикл на 30 строк:
    \foreach \n in {1,...,30} {
        &  &  \\
        \hline
    }
\end{tabular}

\end{document}

""" % (
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            data["user_id"],
            data["group_id"],
            " \\\\ \n".join([f"{s['scheduleDate']} & {s['teacherName']} / {s['lessonName'] or 'N/A'}" for s in data["schedule_dates"]]) or "Нет данных",
            " \\\\ \n".join([f"{a['date'].date()} & {str(a['attendance'])} & {a['reason'] or 'N/A'} & {a['status'] or 'N/A'}" for a in data["attendances"]]) or "Нет данных"
        )
