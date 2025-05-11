from pydantic import BaseModel
from typing import Optional, List
from datetime import date, time, datetime
from enum import Enum

class StatusEnum(str, Enum):
    present = "present"
    absent = "absent"

class ReasonTypeEnum(str, Enum):
    medical = "medical"
    respectful = "respectful"
    other = "other"

class MakeupStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    completed = "completed"
    rejected = "rejected"

class AttendanceBase(BaseModel):
    student_id: int
    schedule_id: int
    date: datetime
    status: StatusEnum
    reason_type: Optional[ReasonTypeEnum] = None
    reason_details: Optional[str] = None
    reason_approved: Optional[bool] = None

    class Config:
        from_attributes = True

class AttendanceCreate(AttendanceBase):
    qr_code: Optional[str] = None

class StarostaAttendanceCreate(BaseModel):
    student_id: int
    schedule_id: int
    date: datetime
    status: StatusEnum
    reason_type: Optional[ReasonTypeEnum] = None
    reason_details: Optional[str] = None

    class Config:
        from_attributes = True

class AttendanceUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    reason_type: Optional[ReasonTypeEnum] = None
    reason_details: Optional[str] = None
    reason_approved: Optional[bool] = None

    class Config:
        from_attributes = True

class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    schedule_id: int
    date: date
    status: str

    class Config:
        from_attributes = True

class MakeupBase(BaseModel):
    attendance_id: int
    status: MakeupStatusEnum
    date: datetime
    time: str
    room: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class MakeupCreate(MakeupBase):
    pass

class MakeupResponse(MakeupBase):
    id: int

    class Config:
        from_attributes = True

class QRCodeResponse(BaseModel):
    id: int
    code: str
    expires_at: datetime

    class Config:
        from_attributes = True

class AttendanceListResponse(BaseModel):
    items: List[AttendanceResponse]
    total: int 