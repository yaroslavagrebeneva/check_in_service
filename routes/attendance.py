from litestar import Router, post, get, put
from litestar.exceptions import HTTPException
from litestar.connection import Request
from pydantic import BaseModel
from jose import jwt, JWTError
from datetime import datetime, timedelta, date
import mysql.connector
from ..database import get_db
from typing import List, Optional
from backend.models import Attendance, Makeup, Schedule, Student, Group, QRCode
from backend.schemas import (
    AttendanceCreate,
    AttendanceResponse,
    MakeupCreate,
    MakeupResponse,
    AttendanceUpdate,
    StarostaAttendanceCreate
)
from ..utils.auth import get_current_user
from .auth import SECRET_KEY, ALGORITHM
import qrcode
import io
import base64
from litestar.di import Provide

class QRCodeData(BaseModel):
    class_name: str
    expires_at: datetime

class ScanQRCodeData(BaseModel):
    qr_code_id: int

@post("/qr-codes")
async def create_qr_code(data: QRCodeData, request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role != "teacher":
            raise HTTPException(status_code=403, detail="Только преподаватель может создавать QR-коды")
        with get_db() as (cursor, conn):
            cursor.execute("SELECT id FROM teachers WHERE user_id = %s", (user_id,))
            teacher = cursor.fetchone()
            if not teacher:
                raise HTTPException(status_code=404, detail="Преподаватель не найден")
            teacher_id = teacher["id"]
            cursor.execute(
                "INSERT INTO qr_codes (teacher_id, class_name, qr_code_data, expires_at) VALUES (%s, %s, %s, %s)",
                (teacher_id, data.class_name, "dummy_qr_data", data.expires_at),
            )
            qr_id = cursor.lastrowid
            return {"id": qr_id, "message": "QR-код создан"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@get("/qr-codes/active")
async def get_active_qr_codes(request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role != "teacher":
            raise HTTPException(status_code=403, detail="Только преподаватель может просматривать активные QR-коды")
        with get_db() as (cursor, _):
            cursor.execute("SELECT id FROM teachers WHERE user_id = %s", (user_id,))
            teacher = cursor.fetchone()
            if not teacher:
                raise HTTPException(status_code=404, detail="Преподаватель не найден")
            teacher_id = teacher["id"]
            cursor.execute(
                "SELECT * FROM qr_codes WHERE teacher_id = %s AND expires_at > NOW() AND is_active = TRUE",
                (teacher_id,),
            )
            qr_codes = cursor.fetchall()
            return {"qr_codes": qr_codes}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@post("/qr-codes/scan")
async def scan_qr_code(data: ScanQRCodeData, request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role != "student":
            raise HTTPException(status_code=403, detail="Только студент может сканировать QR-коды")
        with get_db() as (cursor, conn):
            cursor.execute("SELECT id FROM students WHERE user_id = %s", (user_id,))
            student = cursor.fetchone()
            if not student:
                raise HTTPException(status_code=404, detail="Студент не найден")
            student_id = student["id"]
            cursor.execute(
                "SELECT * FROM qr_codes WHERE id = %s AND expires_at > NOW() AND is_active = TRUE",
                (data.qr_code_id,),
            )
            qr_code = cursor.fetchone()
            if not qr_code:
                raise HTTPException(status_code=404, detail="QR-код не найден или недействителен")
            cursor.execute(
                "INSERT INTO attendance (qr_code_id, student_id, status) VALUES (%s, %s, %s)",
                (data.qr_code_id, student_id, "present"),
            )
            return {"message": "Посещение отмечено"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@get("/my")
async def get_my_attendance(request: Request) -> dict:
    """Получить посещаемость текущего студента."""
    with get_db() as (cursor, _):
        cursor.execute("""
            SELECT a.*, s.subject, s.day_of_week, s.start_time, s.end_time, s.room
            FROM attendance a
            JOIN schedule s ON a.schedule_id = s.id
            WHERE a.student_id = 1
            ORDER BY a.date DESC
        """)
        attendance = cursor.fetchall()
        return {"attendance": attendance}

@get("/group")
async def get_group_attendance(request: Request) -> dict:
    """Получить посещаемость группы."""
    with get_db() as (cursor, _):
        cursor.execute("""
            SELECT a.*, s.subject, s.day_of_week, s.start_time, s.end_time, s.room,
                   st.first_name, st.last_name
            FROM attendance a
            JOIN schedule s ON a.schedule_id = s.id
            JOIN students st ON a.student_id = st.id
            WHERE st.group_id = 1
            ORDER BY a.date DESC
        """)
        attendance = cursor.fetchall()
        return {"attendance": attendance}

@post("/mark")
async def mark_attendance(attendance: AttendanceCreate, request: Request) -> dict:
    """Отметить посещаемость."""
    with get_db() as (cursor, conn):
        cursor.execute("""
            INSERT INTO attendance (student_id, date, status, reason)
            VALUES (%s, %s, %s, %s)
        """, (attendance.student_id, attendance.date, attendance.status, attendance.reason))
        return {"message": "Посещаемость отмечена"}

@put("/{attendance_id:int}")
async def update_attendance(attendance_id: int, attendance: AttendanceCreate, request: Request) -> dict:
    """Обновить запись о посещаемости."""
    with get_db() as (cursor, conn):
        cursor.execute("""
            UPDATE attendance 
            SET status = %s, reason = %s
            WHERE id = %s
        """, (attendance.status, attendance.reason, attendance_id))
        return {"message": "Посещаемость обновлена"}

@get("/attendance/group")
async def get_group_attendance_by_starosta(request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role != "starosta":
            raise HTTPException(status_code=403, detail="Только староста может просматривать посещаемость группы")
        with get_db() as (cursor, _):
            cursor.execute("SELECT group_id FROM starostas WHERE user_id = %s", (user_id,))
            starosta = cursor.fetchone()
            if not starosta:
                raise HTTPException(status_code=404, detail="Староста не найден")
            group_id = starosta["group_id"]
            cursor.execute(
                "SELECT a.*, s.user_id FROM attendance a JOIN students s ON a.student_id = s.id WHERE s.group_id = %s",
                (group_id,),
            )
            attendance = cursor.fetchall()
            return {"attendance": attendance}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@get("/starosta/students")
async def get_group_students(request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role != "starosta":
            raise HTTPException(status_code=403, detail="Только староста может просматривать список студентов")
        with get_db() as (cursor, _):
            cursor.execute("SELECT group_id FROM starostas WHERE user_id = %s", (user_id,))
            starosta = cursor.fetchone()
            if not starosta:
                raise HTTPException(status_code=404, detail="Староста не найден")
            group_id = starosta["group_id"]
            cursor.execute(
                "SELECT s.id, s.user_id, p.first_name, p.middle_name, p.last_name, g.name as group_name FROM students s JOIN personal_info p ON s.user_id = p.user_id JOIN groupss g ON s.group_id = g.id WHERE s.group_id = %s",
                (group_id,),
            )
            students = cursor.fetchall()
            return {"students": students}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@post("/")
async def create_attendance(attendance: AttendanceCreate, request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role not in ["teacher", "starosta"]:
            raise HTTPException(status_code=403, detail="Только преподаватель или староста может создавать записи о посещаемости")
        with get_db() as (cursor, conn):
            cursor.execute(
                "INSERT INTO attendance (student_id, schedule_id, date, status, reason_type, reason_details) VALUES (%s, %s, %s, %s, %s, %s)",
                (attendance.student_id, attendance.schedule_id, attendance.date, attendance.status, attendance.reason_type, attendance.reason_details),
            )
            return {"message": "Запись о посещаемости создана"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@get("/student/{student_id:int}")
async def get_student_attendance(student_id: int, request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role not in ["teacher", "starosta"]:
            raise HTTPException(status_code=403, detail="Только преподаватель или староста может просматривать посещаемость студента")
        with get_db() as (cursor, _):
            cursor.execute(
                "SELECT a.*, s.user_id FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.student_id = %s",
                (student_id,),
            )
            attendance = cursor.fetchall()
            return {"attendance": attendance}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@get("/group/{group_id:int}")
async def get_group_attendance(group_id: int, request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role not in ["teacher", "starosta"]:
            raise HTTPException(status_code=403, detail="Только преподаватель или староста может просматривать посещаемость группы")
        with get_db() as (cursor, _):
            cursor.execute(
                "SELECT a.*, s.user_id FROM attendance a JOIN students s ON a.student_id = s.id WHERE s.group_id = %s",
                (group_id,),
            )
            attendance = cursor.fetchall()
            return {"attendance": attendance}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@post("/makeup")
async def create_makeup(makeup: MakeupCreate, request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role not in ["teacher", "starosta"]:
            raise HTTPException(status_code=403, detail="Только преподаватель или староста может создавать записи об отработке")
        with get_db() as (cursor, conn):
            cursor.execute(
                "INSERT INTO makeups (attendance_id, status, date, time, room, notes) VALUES (%s, %s, %s, %s, %s, %s)",
                (makeup.attendance_id, makeup.status, makeup.date, makeup.time, makeup.room, makeup.notes),
            )
            return {"message": "Запись об отработке создана"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@get("/makeup/{attendance_id:int}")
async def get_makeup(attendance_id: int, request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role not in ["teacher", "starosta"]:
            raise HTTPException(status_code=403, detail="Только преподаватель или староста может просматривать записи об отработке")
        with get_db() as (cursor, _):
            cursor.execute(
                "SELECT * FROM makeups WHERE attendance_id = %s",
                (attendance_id,),
            )
            makeup = cursor.fetchone()
            if not makeup:
                raise HTTPException(status_code=404, detail="Запись об отработке не найдена")
            return {"makeup": makeup}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

@put("/makeup/{makeup_id:int}")
async def update_makeup(makeup_id: int, status: str, request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        if role not in ["teacher", "starosta"]:
            raise HTTPException(status_code=403, detail="Только преподаватель или староста может обновлять записи об отработке")
        with get_db() as (cursor, conn):
            cursor.execute(
                "UPDATE makeups SET status = %s WHERE id = %s",
                (status, makeup_id),
            )
            return {"message": "Запись об отработке обновлена"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

# Генерация QR-кода для занятия
@post("/qr/generate/{schedule_id: int}")
async def generate_qr_code(
    schedule_id: int,
    db = Provide(get_db)
) -> QRCodeResponse:
    # Проверяем существование расписания
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        return {"error": "Schedule not found"}, 404

    # Создаем QR-код
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr_data = f"schedule:{schedule_id}:{datetime.utcnow().timestamp()}"
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    # Создаем изображение QR-кода
    img = qr.make_image(fill_color="black", back_color="white")
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='PNG')
    qr_code_base64 = base64.b64encode(img_buffer.getvalue()).decode()

    # Сохраняем QR-код в базу данных
    qr_code = QRCode(
        schedule_id=schedule_id,
        code=qr_data,
        expires_at=datetime.utcnow() + timedelta(minutes=15)
    )
    db.add(qr_code)
    db.commit()
    db.refresh(qr_code)

    return {
        "id": qr_code.id,
        "code": qr_code_base64,
        "expires_at": qr_code.expires_at
    }

# Отметка посещаемости по QR-коду
@post("/attendance/mark")
async def mark_attendance(
    data: AttendanceCreate,
    db = Provide(get_db)
) -> AttendanceResponse:
    # Проверяем валидность QR-кода
    qr_code = db.query(QRCode).filter(
        QRCode.code == data.qr_code,
        QRCode.is_active == True,
        QRCode.expires_at > datetime.utcnow()
    ).first()
    
    if not qr_code:
        return {"error": "Invalid or expired QR code"}, 400

    # Создаем запись о посещаемости
    attendance = Attendance(
        student_id=data.student_id,
        schedule_id=qr_code.schedule_id,
        qr_code_id=qr_code.id,
        date=datetime.utcnow().date(),
        status="present"
    )
    
    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return {
        "id": attendance.id,
        "student_id": attendance.student_id,
        "schedule_id": attendance.schedule_id,
        "date": attendance.date,
        "status": attendance.status
    }

# Получение посещаемости студента
@get("/attendance/student/{student_id: int}")
async def get_student_attendance(
    student_id: int,
    db = Provide(get_db)
) -> List[AttendanceResponse]:
    attendance_records = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()
    
    return [
        {
            "id": record.id,
            "student_id": record.student_id,
            "schedule_id": record.schedule_id,
            "date": record.date,
            "status": record.status
        }
        for record in attendance_records
    ]

# Получение посещаемости группы
@get("/attendance/group/{group_name: str}")
async def get_group_attendance(
    group_name: str,
    db = Provide(get_db)
) -> List[AttendanceResponse]:
    # Получаем всех студентов группы
    students = db.query(Student).filter(
        Student.group_name == group_name,
        Student.role == "student"
    ).all()
    
    student_ids = [student.id for student in students]
    
    # Получаем записи посещаемости
    attendance_records = db.query(Attendance).filter(
        Attendance.student_id.in_(student_ids)
    ).all()
    
    return [
        {
            "id": record.id,
            "student_id": record.student_id,
            "schedule_id": record.schedule_id,
            "date": record.date,
            "status": record.status
        }
        for record in attendance_records
    ]

# Ручная отметка отсутствия (для старосты)
@post("/attendance/mark-absence")
async def mark_absence(
    data: AttendanceCreate,
    db = Provide(get_db)
) -> AttendanceResponse:
    attendance = Attendance(
        student_id=data.student_id,
        schedule_id=data.schedule_id,
        qr_code_id=None,  # Для ручной отметки QR-код не требуется
        date=datetime.utcnow().date(),
        status="absent"
    )
    
    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return {
        "id": attendance.id,
        "student_id": attendance.student_id,
        "schedule_id": attendance.schedule_id,
        "date": attendance.date,
        "status": attendance.status
    }

# Определяем роутер после всех функций
router = Router(path="/attendance", route_handlers=[
    create_qr_code,
    get_active_qr_codes,
    scan_qr_code,
    get_my_attendance,
    get_group_attendance,
    get_group_attendance_by_starosta,
    get_group_students,
    create_attendance,
    get_student_attendance,
    get_group_attendance,
    update_attendance,
    create_makeup,
    get_makeup,
    update_makeup,
    generate_qr_code,
    mark_attendance,
    get_student_attendance,
    get_group_attendance,
    mark_absence
])
