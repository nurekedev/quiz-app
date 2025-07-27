from enum import Enum

from pydantic import (
    BaseModel,
    ConfigDict,
)

from src.auth.validators import PasswordValidator


class RoleEnum(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserBaseRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    full_name: str
    username: str


class UserRegisterRequest(UserBaseRequest):
    password: PasswordValidator
