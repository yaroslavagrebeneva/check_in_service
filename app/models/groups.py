from sqlalchemy import BigInteger, Column, Integer, TIMESTAMP
from models.base import Base

class Group(Base):
    __tablename__ = "groups"

    group_id = Column(BigInteger, primary_key=True)
    lessons_amount = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP(timezone=False), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=False), nullable=False)
