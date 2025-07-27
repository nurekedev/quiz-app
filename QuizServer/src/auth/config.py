from typing import ClassVar
from src.config import CustomBaseSettings


class Config(CustomBaseSettings):
    ALGORITHM: ClassVar[str] = "RS256"
    TOKEN_TYPE_CLAIM: str = "token_type"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30
    REFRESH_MAX_AGE: int = 60 * 60 * 24 * 14
    COOKIE_DOMAIN: str = "localhost"
    CHECK_REVOKE_TOKEN: bool = False

    PRIVATE_KEY_PATH: str
    PUBLIC_KEY_PATH: str


settings = Config()
