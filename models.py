from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    STAROSTA = "starosta"
    DEAN = "dean"

class BaseModel(Base):
    __abstract__ = True
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(BaseModel):
    __tablename__ = "users"
    
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Связи
    personal_info = relationship("PersonalInfo", back_populates="user", uselist=False)
    student = relationship("Student", back_populates="user", uselist=False)
    teacher = relationship("Teacher", back_populates="user", uselist=False)
    starosta = relationship("Starosta", back_populates="user", uselist=False)

class PersonalInfo(BaseModel):
    __tablename__ = "personal_info"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    middle_name = Column(String)
    
    # Связи
    user = relationship("User", back_populates="personal_info")

class Group(BaseModel):
    __tablename__ = "groups"
    
    name = Column(String, unique=True, nullable=False)
    year = Column(Integer, nullable=False)  # Год поступления
    
    # Связи
    students = relationship("Student", back_populates="group")
    starosta = relationship("Starosta", back_populates="group", uselist=False)

class Student(BaseModel):
    __tablename__ = "students"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    student_id = Column(String, unique=True, nullable=False)  # Уникальный идентификатор студента
    
    # Связи
    user = relationship("User", back_populates="student")
    group = relationship("Group", back_populates="students")
    attendances = relationship("Attendance", back_populates="student")

class Teacher(BaseModel):
    __tablename__ = "teachers"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    department = Column(String, nullable=False)
    
    # Связи
    user = relationship("User", back_populates="teacher")
    qr_codes = relationship("QRCode", back_populates="teacher")

class Starosta(BaseModel):
    __tablename__ = "starostas"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    group_id = Column(Integer, ForeignKey("groups.id"), unique=True)
    
    # Связи
    user = relationship("User", back_populates="starosta")
    group = relationship("Group", back_populates="starosta")

class QRCode(BaseModel):
    __tablename__ = "qr_codes"
    
    code = Column(String, unique=True, nullable=False)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    
    # Связи
    teacher = relationship("Teacher", back_populates="qr_codes")
    attendances = relationship("Attendance", back_populates="qr_code")

class Attendance(BaseModel):
    __tablename__ = "attendance"
    
    student_id = Column(Integer, ForeignKey("students.id"))
    qr_code_id = Column(Integer, ForeignKey("qr_codes.id"))
    status = Column(String, nullable=False)  # present/absent
    reason = Column(String)  # Причина отсутствия
    reason_type = Column(String)  # medical/respectful
    
    # Связи
    student = relationship("Student", back_populates="attendances")
    qr_code = relationship("QRCode", back_populates="attendances") 