from pydantic import BaseModel
from typing import Optional


class ExerciseOut(BaseModel):
    id: int
    lesson_id: int
    exercise_type: str
    order_index: int
    question: str
    correct_answer: str
    options: Optional[str] = None
    words_pool: Optional[str] = None
    hint: Optional[str] = None
    audio_text: Optional[str] = None

    model_config = {"from_attributes": True}


class LessonOut(BaseModel):
    id: int
    title: str
    description: str
    order_index: int
    icon: str
    xp_reward: int

    model_config = {"from_attributes": True}


class LessonWithExercises(LessonOut):
    exercises: list[ExerciseOut] = []


class CheckAnswerRequest(BaseModel):
    exercise_id: int
    user_answer: str


class CheckAnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    explanation: Optional[str] = None
    audio_text: Optional[str] = None
