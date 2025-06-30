from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator

# ----------------------------
# User Schemas
# ----------------------------


class UserBase(BaseModel):
    id: str
    is_teacher: bool
    keyclockid: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserCreate(UserBase):
    @field_validator('id')
    def id_required(cls, v):
        if not v:
            raise ValueError('ID is required')
        return v


class UserRead(UserBase):
    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    is_teacher: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None