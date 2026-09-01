from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from datetime import datetime, timezone
from app.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    lesson_id = Column(Integer, nullable=False)
    completed = Column(Boolean, default=False)
    best_score = Column(Integer, default=0)
    stars = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)


class ConversationMessage(Base):
    __tablename__ = "conversation_messages"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    correction_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
