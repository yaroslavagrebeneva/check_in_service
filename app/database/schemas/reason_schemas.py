from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator
from zoneinfo import ZoneInfo

from app.database.enums import ReasonNameEnum, StatusEnum

# ----------------------------
# Reason Schemas
# ----------------------------

class ReasonBase(BaseModel):
    doc_url: Optional[str] = None
    comment: Optional[str] = None

class ReasonCreate(ReasonBase):
    reason_name: ReasonNameEnum

    @field_validator('reason_name')
    def reason_name_required(cls, v):
        if not v:
            raise ValueError('Reason name is required')
        return v

class ReasonRead(ReasonBase):
    id: UUID
    reason_name: ReasonNameEnum
    status: StatusEnum
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

    @field_validator('created_at', 'updated_at', mode='before')
    def convert_datetime_to_moscow_tz(cls, v):
        if v is None:
            return v
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        return v.astimezone(ZoneInfo("Europe/Moscow"))
    
class ReasonUpdate(BaseModel):
    reason_name: Optional[ReasonNameEnum] = None
    status: Optional[StatusEnum] = None
    doc_url: Optional[str] = None
    comment: Optional[str] = None

class ReasonStatusOut(BaseModel):
    reason_id: UUID
    status: StatusEnum

    class Config:
        from_attributes = True




