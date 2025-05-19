from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Attendance(BaseModel):
    __tablename__ = "attendance"
    
    student_id = Column(Integer, ForeignKey("students.id"))
    qr_code_id = Column(Integer, ForeignKey("qr_codes.id"))
    status = Column(String, nullable=False)
    reason = Column(String)
    reason_type = Column(String)

    student = relationship("Student", back_populates="attendances")
    qr_code = relationship("QRCode", back_populates="attendances")
