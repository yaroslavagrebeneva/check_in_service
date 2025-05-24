from datetime import datetime
from pydantic import BaseModel


class GroupBase(BaseModel):
    lessons_amount: int


class GroupCreate(GroupBase):
    pass 


class GroupUpdate(BaseModel):
    lessons_amount: int


class GroupInDBBase(GroupBase):
    group_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Group(GroupInDBBase):
    pass


class GroupInDB(GroupInDBBase):
    pass
