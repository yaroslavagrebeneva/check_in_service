from sqlalchemy import BigInteger, Column, String, Text, TIMESTAMP, Enum
from models.base import Base
from models.enums import ReasonNameEnum, StatusEnum

class Reason(Base):
    __tablename__ = "reasons"

    reason_id = Column(BigInteger, primary_key=True)
    reference = Column(String(255), nullable=True)
    comment = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=False), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False)
    reason_name = Column(Enum(ReasonNameEnum), nullable=False)
    status = Column(Enum(StatusEnum), nullable=False)
