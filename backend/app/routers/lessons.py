from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.lesson import Lesson, Exercise
from app.models.progress import UserProgress
from app.schemas.lesson import LessonOut, LessonWithExercises, ExerciseOut

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


@router.get("", response_model=list[LessonOut])
def get_lessons(db: Session = Depends(get_db)):
    return db.query(Lesson).order_by(Lesson.order_index).all()


@router.get("/{lesson_id}", response_model=LessonWithExercises)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    exercises = (
        db.query(Exercise)
        .filter(Exercise.lesson_id == lesson_id)
        .order_by(Exercise.order_index)
        .all()
    )
    return LessonWithExercises(
        **{c.name: getattr(lesson, c.name) for c in lesson.__table__.columns},
        exercises=[ExerciseOut.model_validate(e) for e in exercises],
    )
