from typing import Any
from fastapi import BackgroundTasks
from fastapi_mail import (
    FastMail,
    MessageSchema,
    MessageType,
)

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import EmailStr


from src.exceptions import NotFound

from src.quiz.utils import paginate


class BaseService:
    """Base service class for CRUD operations."""

    model = None

    @classmethod
    async def get_all(cls, session: AsyncSession, pg_dep):
        stmt = select(cls.model)
        result = await paginate(
            session=session, query=stmt, page=pg_dep.page, size=pg_dep.size
        )
        return result

    @classmethod
    async def get_by_id(cls, session: AsyncSession, instance_id: int):
        result = await session.execute(
            select(cls.model).where(cls.model.id == instance_id)
        )
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFound()
        return instance

    @classmethod
    async def create(cls, session: AsyncSession, data: Any):
        instance = cls.model(**data.dict())
        session.add(instance)
        await session.commit()
        await session.refresh(instance)
        return instance

    @classmethod
    async def update(
        cls, session: AsyncSession, instance_id: int, data: dict[str, Any]
    ):
        instance = await cls.get_by_id(session, instance_id)
        for key, value in data.items():
            setattr(instance, key, value)
        session.add(instance)
        await session.commit()
        await session.refresh(instance)
        return instance

    @classmethod
    async def destroy(cls, session: AsyncSession, instance_id: int):
        instance = await cls.get_by_id(session, instance_id)
        await session.delete(instance)
        await session.commit()
        return instance

