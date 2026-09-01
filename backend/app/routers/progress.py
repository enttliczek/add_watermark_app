from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.database import get_db
from app.models.lesson import Lesson
from app.models.progress import UserProgress
from app.schemas.progress import ProgressOut, CompleteLesson, OverallStats

router = APIRouter(prefix="/api/progress", tags=["progress"])

USER_ID = 1


@router.get("", response_model=OverallStats)
def get_stats(db: Session = Depends(get_db)):
    total_lessons = db.query(Lesson).count()
    completed = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == USER_ID, UserProgress.completed == True)
        .count()
    )
    xp_rows = (
        db.query(UserProgress, Lesson)
        .join(Lesson, UserProgress.lesson_id == Lesson.id)
        .filter(UserProgress.user_id == USER_ID, UserProgress.completed == True)
        .all()
    )
    total_xp = sum(lesson.xp_reward for _, lesson in xp_rows)
    return OverallStats(total_xp=total_xp, completed_lessons=completed, total_lessons=total_lessons)


@router.get("/lessons", response_model=list[ProgressOut])
def get_lesson_progress(db: Session = Depends(get_db)):
    return db.query(UserProgress).filter(UserProgress.user_id == USER_ID).all()


@router.post("/lessons/{lesson_id}/complete", response_model=ProgressOut)
def complete_lesson(lesson_id: int, body: CompleteLesson, db: Session = Depends(get_db)):
    stars = 3 if body.lives_remaining == 3 else (2 if body.lives_remaining == 2 else (1 if body.lives_remaining >= 1 else 0))

    record = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == USER_ID, UserProgress.lesson_id == lesson_id)
        .first()
    )
    if record:
        if body.score > record.best_score:
            record.best_score = body.score
            record.stars = stars
        record.completed = True
        record.completed_at = datetime.now(timezone.utc)
    else:
        record = UserProgress(
            user_id=USER_ID,
            lesson_id=lesson_id,
            completed=True,
            best_score=body.score,
            stars=stars,
            completed_at=datetime.now(timezone.utc),
        )
        db.add(record)
    db.commit()
    db.refresh(record)
    return record
