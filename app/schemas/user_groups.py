from pydantic import BaseModel


class UserGroupBase(BaseModel):
    user_id: int
    group_id: int


class UserGroupCreate(UserGroupBase):
    pass


class UserGroupUpdate(BaseModel):
    user_id: int
    group_id: int


class UserGroupInDBBase(UserGroupBase):

    class Config:
        orm_mode = True


class UserGroup(UserGroupInDBBase):
    pass


class UserGroupInDB(UserGroupInDBBase):
    pass
