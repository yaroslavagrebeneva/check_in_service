from litestar import Router, post, get
from litestar.exceptions import HTTPException
from litestar.connection import Request
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
import mysql.connector
from ..database import get_db

# Определение SECRET_KEY и ALGORITHM
SECRET_KEY = "your-secret-key"  # Замените на безопасный ключ
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginData(BaseModel):
    username: str
    password: str

class RegisterData(BaseModel):
    username: str
    email: str
    password: str
    role: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    group_name: str | None = None
    department: str | None = None

@get("/groups")
async def get_groups() -> dict:
    """Получить список всех групп."""
    try:
        with get_db() as (cursor, _):
            cursor.execute("SELECT id, name FROM groupss ORDER BY name")
            groups = cursor.fetchall()
            return {
                "groups": [
                    {"id": group["id"], "name": group["name"]}
                    for group in groups
                ]
            }
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Ошибка базы данных при загрузке групп: {str(e)}")

@post("/login")
async def login(data: LoginData) -> dict:
    """Аутентификация пользователя."""
    with get_db() as (cursor, _):
        cursor.execute("SELECT * FROM users WHERE username = %s", (data.username,))
        user = cursor.fetchone()
        if not user or not pwd_context.verify(data.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Неверные данные")
        
        token = jwt.encode(
            {"sub": user["id"], "role": user["role"], "exp": datetime.utcnow() + timedelta(hours=24)},
            SECRET_KEY,
            algorithm=ALGORITHM,
        )
        return {"token": token, "role": user["role"]}

@post("/register")
async def register(data: RegisterData) -> dict:
    """Регистрация нового пользователя."""
    with get_db() as (cursor, conn):
        hashed_password = pwd_context.hash(data.password)
        try:
            cursor.execute(
                "INSERT INTO users (username, email, password_hash, role) VALUES (%s, %s, %s, %s)",
                (data.username, data.email, hashed_password, data.role),
            )
            user_id = cursor.lastrowid
            cursor.execute(
                "INSERT INTO personal_info (user_id, first_name, middle_name, last_name) VALUES (%s, %s, %s, %s)",
                (user_id, data.first_name, data.middle_name, data.last_name),
            )
            if data.role == "student":
                if not data.group_name:
                    raise HTTPException(status_code=400, detail="Для студента необходимо указать группу")
                cursor.execute("SELECT id FROM groupss WHERE name = %s", (data.group_name,))
                group = cursor.fetchone()
                if not group:
                    raise HTTPException(status_code=400, detail="Указанная группа не существует")
                cursor.execute("INSERT INTO students (user_id, group_id, student_id) VALUES (%s, %s, %s)", (user_id, group["id"], str(user_id)))
            elif data.role == "teacher":
                if not data.department:
                    raise HTTPException(status_code=400, detail="Для преподавателя необходимо указать кафедру")
                cursor.execute("INSERT INTO teachers (user_id, department) VALUES (%s, %s)", (user_id, data.department))
            elif data.role == "starosta":
                if not data.group_name:
                    raise HTTPException(status_code=400, detail="Для старосты необходимо указать группу")
                cursor.execute("SELECT id FROM groupss WHERE name = %s", (data.group_name,))
                group = cursor.fetchone()
                if not group:
                    raise HTTPException(status_code=400, detail="Указанная группа не существует")
                cursor.execute("INSERT INTO starostas (user_id, group_id) VALUES (%s, %s)", (user_id, group["id"]))
            conn.commit()  # Фиксируем изменения
            return {"message": "Регистрация успешна"}
        except mysql.connector.Error as e:
            conn.rollback()  # Откатываем изменения при ошибке
            raise HTTPException(status_code=400, detail=f"Ошибка регистрации: {str(e)}")

@get("/me")
async def get_me(request: Request) -> dict:
    """Получить данные текущего пользователя."""
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload["sub"]
        role = payload["role"]
        with get_db() as (cursor, _):
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="Пользователь не найден")
            cursor.execute("SELECT * FROM personal_info WHERE user_id = %s", (user_id,))
            personal = cursor.fetchone()
            if not personal:
                raise HTTPException(status_code=404, detail="Персональные данные не найдены")
            return {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "role": user["role"],
                "first_name": personal["first_name"],
                "middle_name": personal["middle_name"],
                "last_name": personal["last_name"]
            }
    except JWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")

router = Router(path="/auth", route_handlers=[login, register, get_me, get_groups])