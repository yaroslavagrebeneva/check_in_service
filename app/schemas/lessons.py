from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class LessonBase(BaseModel):
    lesson_name: str
    lesson_date: date
    group_id: int
    teacher_id: int


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    lesson_name: Optional[str] = None
    lesson_date: Optional[date] = None
    group_id: Optional[int] = None
    teacher_id: Optional[int] = None


class LessonInDBBase(LessonBase):
    lesson_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Lesson(LessonInDBBase):
    pass


class LessonInDB(LessonInDBBase):
    pass
