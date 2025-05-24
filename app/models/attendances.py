from sqlalchemy import BigInteger, Column, Boolean, Integer, TIMESTAMP, ForeignKey
from models.base import Base

class Attendance(Base):
    __tablename__ = "attendances"

    attendance_id = Column(BigInteger, primary_key=True)
    attendance = Column(Boolean, nullable=False)
    missed_count = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP(timezone=False), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False)
    lesson_id = Column(BigInteger, ForeignKey("lessons.lesson_id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.user_id"), nullable=False)
    reason_id = Column(BigInteger, ForeignKey("reasons.reason_id"), nullable=False)
    is_qr = Column(Boolean, nullable=False, default=False)
