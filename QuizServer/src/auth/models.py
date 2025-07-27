from datetime import datetime, timezone

from pydantic import ConfigDict

from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import ENUM as PgEnum

from src.schemas import EntityMeta
from src.auth.schemas import RoleEnum


class User(EntityMeta):
    __tablename__ = "users"

    model_config = ConfigDict(from_attributes=True)
    id = Column(Integer, primary_key=True)
    full_name = Column(
        String(255),
    )
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    role = Column(PgEnum(RoleEnum), default=RoleEnum.USER)
    is_active = Column(Boolean, default=True)

    quiz_results = relationship("QuizResult", back_populates="user", lazy="dynamic")
