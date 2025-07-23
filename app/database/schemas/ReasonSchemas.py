from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, field_validator
from app.database.enums import ReasonNameEnum, StatusEnum


# ----------------------------
# Reason Schemas
# ----------------------------

class ReasonBase(BaseModel):
    doc_url: Optional[str] = None
    comment: Optional[str] = None


class ReasonCreate(ReasonBase):
    reason_name: ReasonNameEnum
    status: StatusEnum

    @field_validator('reason_name')
    def reason_name_required(cls, v):
        if not v:
            raise ValueError('Reason name is required')
        return v


class ReasonRead(ReasonBase):
    id: UUID  # можно и str, если так в БД
    reason_name: ReasonNameEnum
    status: StatusEnum
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReasonUpdate(BaseModel):
    reason_name: Optional[ReasonNameEnum] = None
    status: Optional[StatusEnum] = None
    doc_url: Optional[str] = None
    comment: Optional[str] = None
