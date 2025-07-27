from typing import Set, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, desc, asc
from sqlalchemy.orm import selectinload

from src.quiz.utils import paginate
from src.quiz.models import (
    Quiz,
    quiz_tags,
    Question,
    QuizResult,
    UserAnswer,
    Option,
    Tag,
)


from src.quiz.dependencies import PaginationDep
from src.quiz.utils import (
    paginate as custom_paginate,
)
from src.quiz.exceptions import (
    QuestionDoesNotFound,
)

from src.quiz.schemas import *


from src.service import BaseService
from src.exceptions import *


class TagService(BaseService):
    model = Tag

    @classmethod
    async def get_or_create(cls, session: AsyncSession, tag_name: str) -> Tag:
        stmt = select(cls.model).where(cls.model.name == tag_name)
        result = await session.execute(stmt)
        tag = result.scalar_one_or_none()
        if tag:
            return tag
        tag = Tag(name=tag_name)
        session.add(tag)
        await session.flush()
        return tag


class QuizResultService(BaseService):
    model = QuizResult

    @classmethod
    async def get_user_quiz_results(cls, session: AsyncSession, user_id: int):
        pass

    @classmethod
    async def get_user_current_quiz(cls, session: AsyncSession, user_id: int):
        stmt = select(cls.model).where(
            cls.model.user_id == user_id, cls.model.completed_at.is_(None)
        )
        result = await session.execute(stmt)
        quiz_result = result.scalar_one_or_none()
        return quiz_result

    @classmethod
    async def get_user_completed_quizzes(cls, session: AsyncSession, user_id: int):
        stmt = select(cls.model).where(
            cls.model.user_id == user_id, cls.model.completed_at.is_not(None)
        )
        result = await session.execute(stmt)
        quiz_results = result.scalars().all()
        return quiz_results

    @classmethod
    async def get_quiz_result_list(
        cls, session: AsyncSession, quiz_id: int, pagination: PaginationDep
    ):
        stmt = (
            select(cls.model)
            .where(cls.model.quiz_id == quiz_id)
            .options(selectinload(cls.model.user))
            .order_by(
                desc(cls.model.total_score),
                asc(cls.model.completed_at - cls.model.started_at),
            )
        )

        result = await paginate(
            session=session, query=stmt, page=pagination.page, size=pagination.size
        )

        return result


class OptionService(BaseService):
    model = Option

    @classmethod
    async def create(cls, session: AsyncSession, data: dict):
        option = cls.model(**data)
        session.add(option)
        await session.flush()
        return option

    @classmethod
    async def find_correct_options(cls, session: AsyncSession, question_id: int) -> Set:
        stmt = select(cls.model).where(
            cls.model.question_id == question_id, cls.model.is_correct == True
        )
        result = await session.execute(stmt)
        return {opt.id for opt in result.scalars().all()}


class UserAnswerService(BaseService):
    model = UserAnswer

    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        quiz_result_id: int,
        questions: List,
        answers: dict,
    ) -> List[UserAnswer]:
        user_answers = []

        for question in questions:
            qid = question.id
            answer = answers.get(str(qid)) or answers.get(qid)
            if answer is None:
                continue

            # SINGLE/MULTIPLE (option_ids)
            if question.type in (QuestionTypeEnum.SINGLE, QuestionTypeEnum.MULTIPLE):
                # Преобразуем ответ к списку id (опций)
                if isinstance(answer, str):
                    option_ids = [int(x) for x in answer.split(",") if x.strip()]
                else:
                    option_ids = list(map(int, answer))

                # Получаем правильные варианты
                correct_option_ids = await OptionService.find_correct_options(
                    session, qid
                )  # set[int]

                selected = set(option_ids)
                correct_set = correct_option_ids

                # SINGLE
                if question.type == QuestionTypeEnum.SINGLE:
                    is_correct = (len(selected) == 1) and (
                        next(iter(selected)) in correct_set
                    )
                    score = question.point if is_correct else 0.0

                # MULTIPLE (по строгой схеме с частичным баллом)
                else:
                    if not selected or not correct_set:
                        is_correct, score = False, 0.0
                    elif selected - correct_set:  # есть неверные
                        is_correct, score = False, 0.0
                    elif selected == correct_set:  # все правильные и только они
                        is_correct, score = True, float(question.point)
                    else:
                        # Частичный балл за правильно выбранные без ошибок
                        is_correct = False
                        score = float(question.point) * (
                            len(selected & correct_set) / len(correct_set)
                        )

                ua = cls.model(
                    quiz_result_id=quiz_result_id,
                    question_id=qid,
                    option_ids=option_ids,
                    is_correct=is_correct,
                    score=score,
                )
                user_answers.append(ua)

            # TEXT
            elif question.type == QuestionTypeEnum.TEXT:
                is_correct = False
                score = 0.0

                if (
                    answer.strip().lower()
                    == question.correct_text_answer.strip().lower()
                ):
                    is_correct = True
                    score = float(question.point)

                ua = cls.model(
                    quiz_result_id=quiz_result_id,
                    question_id=qid,
                    text_answer=answer,
                    is_correct=is_correct,
                    score=score,
                )
                user_answers.append(ua)

        session.add_all(user_answers)
        await session.commit()
        return user_answers


class QuestionService(BaseService):
    model = Question

    @classmethod
    async def create(cls, session, data):

        option_data = data.pop("options", None)

        question = Question(**data)
        session.add(question)
        await session.flush()

        if (
            data["type"] in (QuestionTypeEnum.SINGLE, QuestionTypeEnum.MULTIPLE)
            and option_data
        ):
            for o_data in option_data:
                await OptionService.create(
                    session, {"question_id": question.id, **o_data}
                )
        return question

    @classmethod
    async def get_quiz_questions(
        cls, session: AsyncSession, quiz_id: int, pagination: PaginationDep
    ):
        stmt = (
            select(cls.model)
            .where(cls.model.quiz_id == quiz_id)
            .options(selectinload(cls.model.options))
        )

        result = await custom_paginate(
            query=stmt, session=session, page=pagination.page, size=pagination.size
        )

        quiz_questions = result["items"]
        return CustomPaginationResponse(
            total=result["total"],
            page=result["page"],
            size=result["size"],
            pages=result["pages"],
            items=quiz_questions,
        )


class QuizService(BaseService):
    model = Quiz

    @classmethod
    async def get_all(
        cls,
        session: AsyncSession,
        pg_dep,
        query: Optional[str] = None,
        tag_list: Optional[List[str]] = None,
    ):
        stmt = select(cls.model).options(selectinload(cls.model.tags))

        if query:
            stmt = stmt.where(cls.model.name.ilike(f"%{query}%"))

        if tag_list:
            stmt = stmt.join(cls.model.tags).where(Tag.name.in_(tag_list))

        result = await paginate(
            session=session, query=stmt, page=pg_dep.page, size=pg_dep.size
        )

        return result

    @classmethod
    async def get_by_id(cls, session: AsyncSession, instance_id: int):
        stmt = (
            select(cls.model)
            .where(cls.model.id == instance_id)
            .options(selectinload(cls.model.tags))
        )

        result = await session.execute(stmt)
        quiz = result.scalar_one_or_none()

        if not quiz:
            raise NotFound()

        await session.refresh(quiz)
        return quiz

    @classmethod
    async def submit_quiz(
        cls,
        session: AsyncSession,
        quiz_id: int,
        quiz_result: QuizResult,
        user_answer_data: UserAnswerSchema,
        completed_at: datetime,
    ) -> float:

        stmt = (
            select(cls.model)
            .where(cls.model.id == quiz_id)
            .options(selectinload(cls.model.questions).selectinload(Question.options))
        )

        result = await session.execute(stmt)
        quiz = result.scalar_one_or_none()
        if not quiz:
            raise NotFound()
        await session.refresh(quiz)

        for key, _ in user_answer_data.answers.items():
            if key not in [str(q.id) for q in quiz.questions]:
                raise QuestionDoesNotFound()

        results = await UserAnswerService.create(
            session,
            quiz_result_id=quiz_result.id,
            questions=quiz.questions,
            answers=user_answer_data.answers,
        )

        total_score = sum(ans.score for ans in results)
        quiz_result.total_score = total_score
        quiz_result.completed_at = completed_at

        await session.commit()
        await session.refresh(quiz_result)

        return total_score

    @classmethod
    async def create(cls, session: AsyncSession, data: Any):
        quiz = cls.model(
            name=data.name,
            description=data.description,
        )
        session.add(quiz)
        await session.flush()

        for tag_name in data.tags:
            tag = await TagService.get_or_create(session, tag_name)
            stmt = insert(quiz_tags).values(quiz_id=quiz.id, tag_id=tag.id)
            await session.execute(stmt)

        for q_data in data.questions:
            await QuestionService.create(
                session, {**q_data.model_dump(), "quiz_id": quiz.id}
            )

        await session.refresh(quiz, attribute_names=["tags"])
        await session.commit()
        return quiz
