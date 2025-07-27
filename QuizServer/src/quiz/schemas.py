from enum import Enum
from typing import Optional, List, Dict

from fastapi import Query


from fastapi_pagination.bases import RawParams, AbstractParams
from fastapi_pagination import Page
from pydantic import (
    Field,
    BaseModel,
    ConfigDict,
    field_validator,
)

from datetime import datetime


class QuestionTypeEnum(str, Enum):
    SINGLE = "single"
    MULTIPLE = "multiple"
    TEXT = "text"


class TagSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class OptionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str


class QuestionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True)

    id: int
    text: str
    type: str
    point: int
    options: List[OptionSchema] = []


class QuizBaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None
    created_at: datetime
    tags: List[TagSchema] = []


class CustomPaginationResponse(BaseModel):
    total: int
    page: int
    size: int
    pages: int
    items: List[QuestionSchema]


class QuizDetailSchema(QuizBaseSchema):
    questions: CustomPaginationResponse


class RatedQuizSchema(BaseModel):
    rating: float = Query(
        ..., ge=0.0, le=5.0, description="Rating for the quiz (0.0 to 5.0)"
    )


class UserAnswerSchema(BaseModel):
    answers: Dict[str, str]

    @field_validator("answers")
    def validate_answers(cls, v):
        for key in v.keys():
            try:
                int(key)
            except ValueError:
                raise ValueError(f"Invalid question ID: {key}")
        return v


class OptionCreate(BaseModel):
    text: str
    is_correct: bool


class QuestionCreate(BaseModel):
    text: str
    type: QuestionTypeEnum
    point: int = 1
    correct_text_answer: Optional[str] = None
    options: Optional[List[OptionCreate]] = Field(default_factory=list)


class QuizCreate(BaseModel):
    name: str
    description: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    questions: List[QuestionCreate]


class QuizResultSchema(BaseModel):
    quiz_id: int
    user_id: int
    completed_at: datetime | None = None
    total_score: float = 0.0


class PaginationSchema(BaseModel, AbstractParams):
    page: int = Query(1, ge=1, description="Page number")
    size: int = Query(50, ge=1, le=100, description="Page size")

    def to_raw_params(self) -> RawParams:
        return RawParams(
            limit=self.size if self.size is not None else None,
            offset=(
                self.size * (self.page - 1)
                if self.page is not None and self.size is not None
                else None
            ),
        )


class PaginationPage(Page):
    __params_type__ = PaginationSchema
