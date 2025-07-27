from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Float,
    Text,
    ForeignKey,
    JSON,
    Table,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ENUM as PgEnum

from src.schemas import EntityMeta
from src.quiz.schemas import QuestionTypeEnum


quiz_tags = Table(
    "quiz_tags",
    EntityMeta.metadata,
    Column("quiz_id", Integer, ForeignKey("quizzes.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)


class Quiz(EntityMeta):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    questions = relationship("Question", backref="quiz", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary=quiz_tags, back_populates="quizzes")


class Tag(EntityMeta):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    quizzes = relationship("Quiz", secondary=quiz_tags, back_populates="tags")


class Question(EntityMeta):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    text = Column(Text, nullable=False)
    type = Column(PgEnum(QuestionTypeEnum), nullable=False)
    point = Column(Integer, nullable=False)
    correct_text_answer = Column(Text, nullable=True)

    options = relationship("Option", backref="question", cascade="all, delete-orphan")


class Option(EntityMeta):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True)
    question_id = Column(
        Integer, ForeignKey("questions.id"), nullable=False, index=True
    )
    text = Column(String(255), nullable=False)
    is_correct = Column(Boolean, default=False)


class QuizResult(EntityMeta):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    started_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)
    rating = Column(Float, nullable=True)
    total_score = Column(Float, default=0.0)

    __table_args__ = (
        CheckConstraint("rating >= 1.0 AND rating <=5.0", name="rating_range"),
    )

    user = relationship("User", back_populates="quiz_results")


class UserAnswer(EntityMeta):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True)
    quiz_result_id = Column(
        Integer, ForeignKey("quiz_results.id"), nullable=False, index=True
    )
    question_id = Column(
        Integer, ForeignKey("questions.id"), nullable=False, index=True
    )
    option_ids = Column(JSON, nullable=True)
    text_answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, default=False)
    score = Column(Float, default=0.0)


class Achievement(EntityMeta):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True)
    slug = Column(String(100), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)


class UserAchievement(EntityMeta):
    __tablename__ = "user_achievements"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), primary_key=True)
    date_earned = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    achievement = relationship("Achievement", backref="user_achievements")
