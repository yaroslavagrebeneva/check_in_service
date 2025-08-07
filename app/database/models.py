from datetime import datetime, timezone

from sqlalchemy import Column, String, Boolean, Enum, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid

from .enums import ValidationTypeEnum, ReasonNameEnum, StatusEnum

Base = declarative_base()


class Reason(Base):
    __tablename__ = "reasons"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        nullable=False,
        unique=True,
        default=uuid.uuid4
    )
    doc_url = Column(Text, nullable=True)
    comment = Column(Text, nullable=True)
    reason_name = Column(
        Enum(ReasonNameEnum, name="reason_name_enum"),
        nullable=False
    )
    status = Column(
        Enum(StatusEnum, name="status_enum"),
        nullable=False,
        default=StatusEnum.PENDING
    )
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    attendances = relationship("Attendance", back_populates="reason", uselist=False)


class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        nullable=False,
        unique=True,
        default=uuid.uuid4
    )
    attendance = Column(Boolean, nullable=False)
    validation_type = Column(
        Enum(ValidationTypeEnum, name="validation_type_enum"),
        nullable=False
    )
    lessonid = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now(), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=True)
    reason_id = Column(
        UUID(as_uuid=True),
        ForeignKey("reasons.id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    reason = relationship("Reason", back_populates="attendances")
