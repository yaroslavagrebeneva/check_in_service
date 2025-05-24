from sqlalchemy import BigInteger, Column, String, Date, TIMESTAMP, ForeignKey
from models.base import Base

class Lesson(Base):
    __tablename__ = "lessons"

    lesson_id = Column(BigInteger, primary_key=True)
    lesson_name = Column(String(255), nullable=False)
    lesson_date = Column(Date, nullable=False)
    created_at = Column(TIMESTAMP(timezone=False), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False)
    group_id = Column(BigInteger, ForeignKey("groups.group_id"), nullable=False)
    teacher_id = Column(BigInteger, ForeignKey("users.user_id"), nullable=False)
