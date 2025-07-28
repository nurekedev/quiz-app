from datetime import timezone

from fastapi import (
    APIRouter,
    Path,
    status,
)
from src.database import DBSessionDep
from src.exceptions import *

from src.quiz.schemas import *
from src.quiz.exceptions import *
from src.quiz.service import *
from src.quiz.dependencies import PaginationDep



from src.auth.dependencies import (
    UserDep,
    AdminDep
)


quiz_router = APIRouter(tags=["quiz"], prefix="/quizzes")

@quiz_router.get(
    "/tags", status_code=status.HTTP_200_OK
)
async def get_tag_list(
    db: DBSessionDep,
    pg_dep: PaginationDep,
):
    return await TagService.get_all(db, pg_dep)

@quiz_router.post(
    "/", status_code=status.HTTP_201_CREATED, response_model=QuizBaseSchema
)
async def create_quiz(
    admin_dep: AdminDep,
    db: DBSessionDep,
    quiz_data: QuizCreate,
):

    quiz = await QuizService.create(db, quiz_data)
    return quiz


@quiz_router.get(
    "/", status_code=status.HTTP_200_OK, response_model=PaginationPage[QuizBaseSchema]
)
async def get_quizzes(
    db: DBSessionDep,
    pg_dep: PaginationDep,
    query: str | None = Query(None, description="Search by quiz title"),
    tag_list: List[str] = Query(default=[], description="Filter by tag names"),
):
    quizzes = await QuizService.get_all(db, pg_dep, query=query, tag_list=tag_list)
    return quizzes


@quiz_router.get("/{quiz_id}")
async def get_quiz_by_id(
    db: DBSessionDep,
    pagination_dep: PaginationDep,
    quiz_id: int = Path(gt=0),
):
    quiz = await QuizService.get_by_id(db, instance_id=quiz_id)
    questions = await QuestionService.get_quiz_questions(
        session=db, quiz_id=quiz_id, pagination=pagination_dep
    )

    return QuizDetailSchema.model_validate(
        {
            **vars(quiz),
            "questions": questions,
        }
    )


@quiz_router.post("/{quiz_id}/start", status_code=status.HTTP_200_OK)
async def start_quiz(
    user_dep: UserDep,
    db: DBSessionDep,
    quiz_id: int = Path(gt=0),
):
    if current_quiz := await QuizResultService.get_user_current_quiz(
        db, user_dep["user_id"]
    ):
        raise QuizAlreadyStarted(
            detail=f"You have already started with id={current_quiz.quiz_id}. Finish it to start a new one."
        )
    quiz_result = await QuizResultService.create(
        db, QuizResultSchema(quiz_id=quiz_id, user_id=user_dep["user_id"])
    )
    return quiz_result


@quiz_router.post("/{quiz_id}/submit", status_code=status.HTTP_200_OK)
async def submit_quiz(
    user_dep: UserDep,
    db: DBSessionDep,
    user_answers: UserAnswerSchema,
    quiz_id: int = Path(gt=0),
):
    if current_quiz := await QuizResultService.get_user_current_quiz(
        db, user_dep["user_id"]
    ):
        if current_quiz.quiz_id != quiz_id:
            raise PermissionDenied(
                detail=f"You have already started with id={current_quiz.quiz_id}. Finish it to start a new one."
            )
        quiz_result = await QuizService.submit_quiz(
            db, quiz_id, current_quiz, user_answers, datetime.now(timezone.utc)
        )
        return quiz_result
    raise ActiveQuizNotFound()


@quiz_router.post("/{quiz_result_id}/rate", status_code=status.HTTP_200_OK)
async def rate_quiz(
    user_dep: UserDep,
    db: DBSessionDep,
    rated_data: RatedQuizSchema,
    quiz_result_id: int = Path(gt=0),
):
    current_quizzes = await QuizResultService.get_user_completed_quizzes(
        db, user_dep["user_id"]
    )
    if quiz_result_id not in [quiz.id for quiz in current_quizzes]:
        raise PermissionDenied()
    await QuizResultService.update(db, quiz_result_id, rated_data.model_dump())
    return rated_data


@quiz_router.get("/{quiz_id}/result-list", status_code=status.HTTP_200_OK)
async def get_quiz_result_list(
    db: DBSessionDep,
    pagination_dep: PaginationDep,
    quiz_id: int = Path(gt=0),
):
    quiz_results = await QuizResultService.get_quiz_result_list(
        db, quiz_id, pagination_dep
    )
    return quiz_results
