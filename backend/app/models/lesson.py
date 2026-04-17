from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    icon = Column(String, default="📚")
    xp_reward = Column(Integer, default=20)


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    exercise_type = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False)
    question = Column(Text, nullable=False)
    correct_answer = Column(Text, nullable=False)
    options = Column(Text, nullable=True)     # JSON array for multiple_choice
    words_pool = Column(Text, nullable=True)  # JSON array for word_order
    hint = Column(Text, nullable=True)
    audio_text = Column(Text, nullable=True)
