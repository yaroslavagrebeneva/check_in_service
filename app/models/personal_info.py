from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class PersonalInfo(BaseModel):
    __tablename__ = "personal_info"
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    middle_name = Column(String)

    user = relationship("User", back_populates="personal_info")
