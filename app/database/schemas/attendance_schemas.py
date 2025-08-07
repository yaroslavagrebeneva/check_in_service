from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, field_validator
from zoneinfo import ZoneInfo

from app.database.enums import ValidationTypeEnum
from app.database.schemas.reason_schemas import ReasonRead

# ----------------------------
# Attendance Schemas
# ----------------------------

class AttendanceBase(BaseModel):
    id: str
    attendance: bool
    validation_type: ValidationTypeEnum
    lessonid: str
    user_id: str
    reason_id: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    @field_validator('user_id')
    def user_id_required(cls, v):
        if not v:
            raise ValueError('User ID is required')
        return v

class AttendanceRead(AttendanceBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    reason: Optional[ReasonRead] = None

    class Config:
        from_attributes = True

    @field_validator('created_at', 'updated_at', mode='before')
    def convert_datetime_to_moscow_tz(cls, v):
        if v is None:
            return v
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        return v.astimezone(ZoneInfo("Europe/Moscow"))

class AttendanceUpdate(BaseModel):
    attendance: Optional[bool] = None
    validation_type: Optional[ValidationTypeEnum] = None
    lessonid: Optional[str] = None

class AttendanceOut(AttendanceRead):
    subject_name: Optional[str] = None
    teacher_name: Optional[str] = None
    timestamp: Optional[datetime] = None
    status: Optional[str] = None

    @field_validator('timestamp', mode='before')
    def convert_timestamp_to_moscow_tz(cls, v):
        if v is None:
            return v
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        return v.astimezone(ZoneInfo("Europe/Moscow"))

class MissedAttendanceOut(BaseModel):
    id: str
    user_id: str
    subject_name: str
    teacher_name: str
    timestamp: datetime
    status: Optional[ReasonRead]

    class Config:
        from_attributes = True

    @field_validator('timestamp', mode='before')
    def convert_timestamp_to_moscow_tz(cls, v):
        if v is None:
            return v
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        return v.astimezone(ZoneInfo("Europe/Moscow"))
