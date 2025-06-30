from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

from app.database.enums import ValidationTypeEnum
from app.database.schemas.ReasonSchemas import ReasonRead
from app.database.schemas.UserSchemas import UserRead


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
    user: Optional[UserRead] = None
    reason: Optional[ReasonRead] = None

    class Config:
        from_attributes = True


class AttendanceUpdate(BaseModel):
    attendance: Optional[bool] = None
    validation_type: Optional[ValidationTypeEnum] = None
    lessonid: Optional[str] = None