from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from src.config import app_configs, settings
from src.schemas import init_models

from src.auth.routes import auth_router
from src.quiz.routes import quiz_router

from src.exceptions import DetailedHTTPException


@asynccontextmanager
async def lifespan(_application: FastAPI) -> AsyncGenerator:
    await init_models()
    yield


app = FastAPI(**app_configs, lifespan=lifespan, debug=settings.DEBUG)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGINS_REGEX,
    allow_credentials=True,
    allow_methods=("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"),
    allow_headers=settings.CORS_HEADERS,
)

app.include_router(auth_router, tags=["auth"])
app.include_router(quiz_router, tags=["quiz"])


@app.exception_handler(DetailedHTTPException)
async def app_exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.get("/healthcheck", include_in_schema=False)
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
