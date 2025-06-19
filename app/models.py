from sqlalchemy import Column, String, Boolean, Enum, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
from .enums import ValidationTypeEnum, ReasonNameEnum, StatusEnum

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True, nullable=False, unique=True)
    is_teacher = Column(Boolean, nullable=False)
    keyclockid = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    attendances = relationship("Attendance", back_populates="user")

class Reason(Base):
    __tablename__ = "reasons"
    id = Column(String, primary_key=True, index=True, nullable=False, unique=True)
    doc_url = Column(String, nullable=True)
    comment = Column(Text, nullable=True)
    reason_name = Column(Enum(ReasonNameEnum, name="reason_name_enum"), nullable=False)
    status = Column(Enum(StatusEnum, name="status_enum"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    attendances = relationship("Attendance", back_populates="reason")

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(String, primary_key=True, index=True, nullable=False, unique=True)
    attendance = Column(Boolean, nullable=False)
    validation_type = Column(Enum(ValidationTypeEnum, name="validation_type_enum"), nullable=False)
    lessonid = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(String, ForeignKey("users.id"))
    reason_id = Column(String, ForeignKey("reasons.id"))
    
    user = relationship("User", back_populates="attendances")
    reason = relationship("Reason", back_populates="attendances")