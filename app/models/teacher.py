from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Teacher(BaseModel):
    __tablename__ = "teachers"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    department = Column(String, nullable=False)

    user = relationship("User", back_populates="teacher")
    qr_codes = relationship("QRCode", back_populates="teacher")
