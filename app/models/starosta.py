from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Starosta(BaseModel):
    __tablename__ = "starostas"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    group_id = Column(Integer, ForeignKey("groups.id"), unique=True)

    user = relationship("User", back_populates="starosta")
    group = relationship("Group", back_populates="starosta")
