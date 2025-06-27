from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Battle schemas
class BattleBase(BaseModel):
    title: str
    description: Optional[str] = None
    sport_type: str


class BattleCreate(BattleBase):
    pass


class BattleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    sport_type: Optional[str] = None
    is_active: Optional[bool] = None


class Battle(BattleBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
