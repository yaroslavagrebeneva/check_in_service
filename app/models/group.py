from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from .base import BaseModel

class Group(BaseModel):
    __tablename__ = "groups"
    
    name = Column(String, unique=True, nullable=False)
    year = Column(Integer, nullable=False)

    students = relationship("Student", back_populates="group")
    starosta = relationship("Starosta", back_populates="group", uselist=False)
