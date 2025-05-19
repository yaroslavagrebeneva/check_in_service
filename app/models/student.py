from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Student(BaseModel):
    __tablename__ = "students"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    student_id = Column(String, unique=True, nullable=False)

    user = relationship("User", back_populates="student")
    group = relationship("Group", back_populates="students")
    attendances = relationship("Attendance", back_populates="student")
