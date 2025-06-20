from pydantic import BaseModel
from typing import Optional
from .enums import ValidationTypeEnum, ReasonNameEnum, StatusEnum
from datetime import datetime

class UserBase(BaseModel):
    id: str
    is_teacher: bool
    keyclockid: str

class UserRead(UserBase):
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ReasonBase(BaseModel):
    doc_url: Optional[str] = None
    comment: Optional[str] = None
    reason_name: ReasonNameEnum
    status: StatusEnum

class ReasonRead(ReasonBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AttendanceBase(BaseModel):
    attendance: bool
    validation_type: ValidationTypeEnum
    lessonid: str

class AttendanceRead(AttendanceBase):
    id: str
    created_at: datetime
    updated_at: datetime
    user_id: Optional[str] = None
    reason_id: Optional[str] = None

    class Config:
        orm_mode = True

class AttendanceStats(BaseModel):
    total: int
    attended: int
    missed: int
    percent: float

    class Config:
        orm_mode = True