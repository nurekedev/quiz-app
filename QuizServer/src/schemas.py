from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData

from src.database import engine


default_metadata = MetaData(schema="public")


class EntityMeta(AsyncAttrs, DeclarativeBase):
    metadata = default_metadata
    __abstract__ = True


metadata = EntityMeta.metadata


async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(EntityMeta.metadata.create_all)
