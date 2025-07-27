from typing import Any

from fastapi_mail import ConnectionConfig

from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


from src.constants import Environment


class CustomBaseSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )
    ENVIRONMENT: Environment = Environment.STAGING


class Config(CustomBaseSettings):
    DEBUG: bool = False
    PROTOCOL: str = "https"
    DOMAIN: str
    SITE_NAME: str

    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    DATABASE_ASYNC_URL: PostgresDsn
    DATABASE_POOL_SIZE: int = 16
    DATABASE_POOL_TTL: int = 60 * 20
    DATABASE_POOL_PRE_PING: bool = True

    CORS_ORIGINS: list[str] = ["*"]
    CORS_ORIGINS_REGEX: str | None = None
    CORS_HEADERS: list[str] = ["*"]

    APP_VERSION: str = "0.1"

    @property
    def DATABASE_URL(self) -> PostgresDsn:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.POSTGRES_DB}"


settings = Config()


app_configs: dict[str, Any] = {"title": settings.SITE_NAME}
# if settings.ENVIRONMENT.is_deployed:
#     app_configs["root_path"] = f"/v{settings.APP_VERSION}"

# if not settings.ENVIRONMENT.is_debug:
#     app_configs["openapi_url"] = None
