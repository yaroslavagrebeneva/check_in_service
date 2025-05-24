from sqlalchemy import BigInteger, Column, ForeignKey
from models.base import Base

class UserGroup(Base):
    __tablename__ = "user_groups"

    user_id = Column(BigInteger, ForeignKey("users.user_id"), primary_key=True, nullable=False)
    group_id = Column(BigInteger, ForeignKey("groups.group_id"), primary_key=True, nullable=False)
