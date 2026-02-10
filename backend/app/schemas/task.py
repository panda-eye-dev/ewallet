from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    reward_amount: float
    child_id: int

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    reward_amount: Optional[float] = None
    status: Optional[str] = None
    
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    reward_amount: float
    status: str
    parent_id: int
    child_id: int

    class Config:
        from_attributes = True
