from typing import Annotated

from fastapi import Depends
from src.quiz.schemas import PaginationSchema

PaginationDep = Annotated[PaginationSchema, Depends(PaginationSchema)]
