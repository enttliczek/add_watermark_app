from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MessageRequest(BaseModel):
    message: str


class CorrectionData(BaseModel):
    has_error: bool
    original: Optional[str] = None
    corrected: Optional[str] = None
    explanation_pl: Optional[str] = None


class MessageResponse(BaseModel):
    reply: str
    correction: Optional[CorrectionData] = None


class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    correction_json: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
