from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional
from pydantic import BaseModel


class ReasonNameEnum(str, PyEnum):
    ILLNESS = "ILLNESS"
    GOOD_REASON = "GOOD_REASON"
    OTHER = "OTHER"


class StatusEnum(str, PyEnum):
    CONFIRMED = "CONFIRMED"
    PENDING = "PENDING"
    REJECTED = "REJECTED"


class ReasonBase(BaseModel):
    reference: Optional[str] = None
    comment: Optional[str] = None
    reason_name: ReasonNameEnum
    status: StatusEnum


class ReasonCreate(ReasonBase):
    pass


class ReasonUpdate(BaseModel):
    reference: Optional[str] = None
    comment: Optional[str] = None
    reason_name: Optional[ReasonNameEnum] = None
    status: Optional[StatusEnum] = None


class ReasonInDBBase(ReasonBase):
    reason_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Reason(ReasonInDBBase):
    pass


class ReasonInDB(ReasonInDBBase):
    pass
