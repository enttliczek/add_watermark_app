import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import create_tables, SessionLocal
from app.models.lesson import Lesson, Exercise
from app.data.lessons_seed import LESSONS


def seed():
    create_tables()
    db = SessionLocal()
    try:
        if db.query(Lesson).count() > 0:
            print("Database already seeded.")
            return
        for lesson_data in LESSONS:
            exercises = lesson_data.pop("exercises")
            lesson = Lesson(**lesson_data)
            db.add(lesson)
            db.flush()
            for ex_data in exercises:
                exercise = Exercise(lesson_id=lesson.id, **ex_data)
                db.add(exercise)
        db.commit()
        print(f"Seeded {len(LESSONS)} lessons successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
