from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.lesson import Exercise
from app.schemas.lesson import CheckAnswerRequest, CheckAnswerResponse
from app.services.lesson_service import check_answer

router = APIRouter(prefix="/api/exercises", tags=["exercises"])


@router.post("/check", response_model=CheckAnswerResponse)
def check_exercise(body: CheckAnswerRequest, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == body.exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    correct = check_answer(exercise.exercise_type, exercise.correct_answer, body.user_answer)

    return CheckAnswerResponse(
        correct=correct,
        correct_answer=exercise.correct_answer,
        audio_text=exercise.audio_text,
    )
