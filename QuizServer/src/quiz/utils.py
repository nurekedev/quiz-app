from sqlalchemy import Select, select, func

from sqlalchemy.ext.asyncio import AsyncSession


class Paginator:
    def __init__(self, session: AsyncSession, query: Select, page: int, size: int):
        self.session = session
        self.query = query
        self.page = page
        self.size = size
        self.limit = size
        self.offset = (page - 1) * size
        # computed later
        self.number_of_pages = 0

    async def get_response(self) -> dict:
        return {
            "total": await self._get_total_count(),
            "page": self.page,
            "size": self.size,
            "pages": self.number_of_pages,
            "items": [
                todo
                for todo in await self.session.scalars(
                    self.query.limit(self.limit).offset(self.offset)
                )
            ],
        }

    def _get_number_of_pages(self, count: int) -> int:
        rest = count % self.size
        quotient = count // self.size
        return quotient if not rest else quotient + 1

    async def _get_total_count(self) -> int:
        count = await self.session.scalar(
            select(func.count()).select_from(self.query.subquery())
        )
        self.number_of_pages = self._get_number_of_pages(count)
        return count


async def paginate(query: Select, session: AsyncSession, page: int, size: int):
    paginator = Paginator(session, query, page, size)
    return await paginator.get_response()
