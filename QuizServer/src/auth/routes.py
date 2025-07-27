from typing import Annotated, Union

from fastapi import APIRouter, Response, Cookie, status
from fastapi.params import Depends

from src.auth.service import (
    RefreshToken,
    UserService,
)

from src.auth.schemas import (
    UserBaseRequest,
    UserRegisterRequest,
    AccessTokenResponse,
)

from src.database import DBSessionDep

from src.auth.exceptions import TokenError
from src.auth.config import settings
from src.auth.utils import load_private_key
from src.auth.dependencies import BaseUserDep

from fastapi.security import OAuth2PasswordRequestForm


from jose import jwt

auth_router = APIRouter(prefix="/auth", tags=["auth"])


@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegisterRequest, db: DBSessionDep):
    new_user = await UserService.create(db, user)


@auth_router.post(
    "/login",
    response_model=AccessTokenResponse,
)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DBSessionDep,
    response: Response,
):
    user = await UserService.get_by_credentials(
        db, form_data.username, form_data.password
    )

    refresh_base = RefreshToken.for_user(user=user)
    refresh = jwt.encode(
        refresh_base.payload, key=load_private_key(), algorithm=settings.ALGORITHM
    )
    access = jwt.encode(
        refresh_base.access_token.payload,
        key=load_private_key(),
        algorithm=settings.ALGORITHM,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        domain=settings.COOKIE_DOMAIN,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
        max_age=settings.REFRESH_MAX_AGE,
    )

    return AccessTokenResponse(access_token=access, token_type="Bearer")


@auth_router.post(
    "/refresh",
    response_model=AccessTokenResponse,
)
async def refresh_token(
    base_user_dep_dp: BaseUserDep,
    db: DBSessionDep,
    refresh_token: Union[str, None] = Cookie(default=None),
):
    if refresh_token is None:
        raise TokenError("Refresh token is missing")

    refresh_base = RefreshToken(refresh_token)

    access = jwt.encode(
        refresh_base.access_token.payload,
        load_private_key(),
        algorithm=settings.ALGORITHM,
    )
    return AccessTokenResponse(access_token=access, token_type="Bearer")


@auth_router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    base_user_dep_dp: BaseUserDep,
    db: DBSessionDep,
    response: Response,
    refresh_token: Union[str, None] = Cookie(default=None),
):
    if refresh_token is None:
        raise TokenError("Refresh token is missing")

    try:
        refresh_base = RefreshToken(refresh_token)
    finally:
        response.delete_cookie(
            key="refresh_token", domain=settings.COOKIE_DOMAIN, path="/"
        )


@auth_router.get(
    "/me",
    response_model=UserBaseRequest,
)
async def get_me(
    base_user_dep_dp: BaseUserDep,
    db: DBSessionDep,
):
    admin = await UserService.get_by_id(db, base_user_dep_dp.get("user_id"))
    return UserBaseRequest.model_validate(admin)
