from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] 

class UserRole(str, Enum):
    parent = "parent"
    child = "child"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: UserRole

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    name: str 
    email: EmailStr
    password: str 

class ChildCreate(BaseModel):
    child_name: str
    email: str
    password: str
