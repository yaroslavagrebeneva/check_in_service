from litestar import Router, get
from litestar.di import Provide
from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy import func
from ..database import get_db
from ..models import User, Attendance, Schedule, Subject
from ..schemas import AttendanceResponse
import pdfkit
from jinja2 import Template
import os
import base64

# Шаблон для PDF-отчета
REPORT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Отчет по посещаемости</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { margin: 20px 0; }
        .signatures { margin-top: 50px; }
        .signature-line { margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Отчет по посещаемости</h1>
        <p>Месяц: {{ month_name }} {{ year }}</p>
        <p>Группа: {{ group_name }}</p>
    </div>

    <div class="summary">
        <p>Общее количество проведённых занятий в месяц: {{ total_classes }}</p>
    </div>

    <table>
        <tr>
            <th>ФИО обучающегося</th>
            <th>Общее количество пропущенных занятий</th>
            <th>Количество пропущенных занятий по уважительной причине</th>
        </tr>
        {% for student in students %}
        <tr>
            <td>{{ student.name }}</td>
            <td>{{ student.total_missed }}</td>
            <td>{{ student.respectful_missed }}</td>
        </tr>
        {% endfor %}
    </table>

    <div class="signatures">
        <div class="signature-line">
            <p>ФИО старосты: _________________</p>
            <p>подпись: _________________</p>
        </div>
        <div class="signature-line">
            <p>ФИО куратора: _________________</p>
            <p>подпись: _________________</p>
        </div>
    </div>
</body>
</html>
"""

@get("/reports/attendance")
async def generate_attendance_report(
    group_name: str,
    month: str,  # Format: YYYY-MM
    db = Provide(get_db)
) -> dict:
    """
    Генерация PDF-отчета по посещаемости.
    
    Параметры:
    - group_name: название группы
    - month: месяц в формате YYYY-MM
    """
    # Преобразуем месяц в даты
    year, month_num = month.split('-')
    start_date = datetime(int(year), int(month_num), 1)
    if int(month_num) == 12:
        end_date = datetime(int(year) + 1, 1, 1) - timedelta(days=1)
    else:
        end_date = datetime(int(year), int(month_num) + 1, 1) - timedelta(days=1)

    # Получаем всех студентов группы
    students = db.query(User).filter(
        User.group_name == group_name,
        User.role == 'student'
    ).all()

    # Получаем все занятия за месяц
    schedules = db.query(Schedule).filter(
        Schedule.date.between(start_date, end_date)
    ).all()

    # Получаем все записи посещаемости
    attendances = db.query(Attendance).join(
        Schedule, Attendance.schedule_id == Schedule.id
    ).filter(
        Schedule.date.between(start_date, end_date),
        Attendance.student_id.in_([s.id for s in students])
    ).all()

    # Создаем словарь для подсчета пропусков
    student_stats = {student.id: {
        'name': f"{student.last_name} {student.first_name} {student.middle_name}",
        'total_missed': 0,
        'respectful_missed': 0
    } for student in students}

    # Подсчитываем пропуски
    for attendance in attendances:
        if attendance.status == 'absent':
            student_stats[attendance.student_id]['total_missed'] += 1
            if attendance.reason and attendance.reason_type in ['medical', 'respectful']:
                student_stats[attendance.student_id]['respectful_missed'] += 1

    # Преобразуем статистику в список
    students_list = list(student_stats.values())

    # Названия месяцев
    month_names = {
        '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
        '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
        '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь'
    }

    # Генерируем HTML
    template = Template(REPORT_TEMPLATE)
    html_content = template.render(
        month_name=month_names[month_num],
        year=year,
        group_name=group_name,
        total_classes=len(schedules),
        students=students_list
    )

    # Конвертируем HTML в PDF
    pdf_options = {
        'page-size': 'A4',
        'margin-top': '20mm',
        'margin-right': '20mm',
        'margin-bottom': '20mm',
        'margin-left': '20mm',
        'encoding': 'UTF-8',
        'no-outline': None
    }

    try:
        pdf_content = pdfkit.from_string(html_content, False, options=pdf_options)
        # Конвертируем PDF в base64
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        
        return {
            "pdf": pdf_base64,
            "filename": f"Посещаемость_за_{month_names[month_num]}_{year}_{group_name}.pdf"
        }
    except Exception as e:
        return {"error": f"Failed to generate PDF: {str(e)}"}, 500

# Роутер для эндпоинтов декана
router = Router(
    path="/dean",
    route_handlers=[generate_attendance_report]
) 