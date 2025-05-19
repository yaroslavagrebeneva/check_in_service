from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class QRCode(BaseModel):
    __tablename__ = "qr_codes"
    
    code = Column(String, unique=True, nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

    teacher = relationship("Teacher", back_populates="qr_codes")
    attendances = relationship("Attendance", back_populates="qr_code")
