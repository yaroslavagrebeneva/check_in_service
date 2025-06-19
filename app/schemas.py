from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from enum import Enum
from .enums import ValidationTypeEnum, ReasonNameEnum, StatusEnum

# ----------------------------
# User Schemas
# ----------------------------

class UserBase(BaseModel):
    id: str
    is_teacher: bool
    keyclockid: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class UserCreate(UserBase):
    @field_validator('id')
    def id_required(cls, v):
        if not v:
            raise ValueError('ID is required')
        return v

class UserRead(UserBase):
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    is_teacher: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# ----------------------------
# Reason Schemas
# ----------------------------

class ReasonBase(BaseModel):
    id: str
    doc_url: Optional[str] = None
    comment: Optional[str] = None
    reason_name: ReasonNameEnum
    status: StatusEnum
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ReasonCreate(ReasonBase):
    @field_validator('reason_name')
    def reason_name_required(cls, v):
        if not v:
            raise ValueError('Reason name is required')
        return v

class ReasonRead(ReasonBase):
    class Config:
        from_attributes = True

class ReasonUpdate(BaseModel):
    doc_url: Optional[str] = None
    comment: Optional[str] = None
    reason_name: Optional[ReasonNameEnum] = None
    status: Optional[StatusEnum] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

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