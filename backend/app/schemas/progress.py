from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProgressOut(BaseModel):
    lesson_id: int
    completed: bool
    best_score: int
    stars: int
    completed_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class CompleteLesson(BaseModel):
    score: int
    lives_remaining: int


class OverallStats(BaseModel):
    total_xp: int
    completed_lessons: int
    total_lessons: int
