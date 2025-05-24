from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class UserBase(BaseModel):
    role: str
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    is_teacher: bool
    total_attended: int = 0
    total_lessons: int = 0
    is_headman: bool = False


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    role: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    is_teacher: Optional[bool] = None
    total_attended: Optional[int] = None
    total_lessons: Optional[int] = None
    is_headman: Optional[bool] = None


class UserInDBBase(UserBase):
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class User(UserInDBBase):
    pass


class UserInDB(UserInDBBase):
    pass
