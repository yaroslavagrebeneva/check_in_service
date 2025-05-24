from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class AttendanceBase(BaseModel):
    # Все поля опциональны — базовый класс для Update
    attendance: Optional[bool] = None
    missed_count: Optional[int] = None
    reason_id: Optional[int] = None
    is_qr: Optional[bool] = None


class AttendanceCreate(BaseModel):
    attendance: bool
    missed_count: int
    reason_id: int
    is_qr: bool = False
    lesson_id: int
    user_id: int


class AttendanceUpdate(AttendanceBase):
    lesson_id: Optional[int] = None
    user_id: Optional[int] = None


class AttendanceInDBBase(AttendanceCreate):
    attendance_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Attendance(AttendanceInDBBase):
    pass


class AttendanceInDB(AttendanceInDBBase):
    pass
