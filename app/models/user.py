from sqlalchemy import Column, String, Boolean, Enum
from sqlalchemy.orm import relationship
from .base import BaseModel
from .enums import UserRole

class User(BaseModel):
    __tablename__ = "users"
    
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)

    personal_info = relationship("PersonalInfo", back_populates="user", uselist=False)
    student = relationship("Student", back_populates="user", uselist=False)
    teacher = relationship("Teacher", back_populates="user", uselist=False)
    starosta = relationship("Starosta", back_populates="user", uselist=False)
