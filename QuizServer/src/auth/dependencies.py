from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from jose import jwt, JWTError

from src.auth.exceptions import UnauthorizedException
from src.exceptions import PermissionDenied

from src.auth.schemas import RoleEnum
from src.auth.utils import load_public_key
from src.auth.config import settings


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, load_public_key(), algorithms=[settings.ALGORITHM])
    except JWTError as exp:
        raise UnauthorizedException(detail=str(exp))

    token_type = payload.get("token_type", None)
    if not token_type or token_type != "access":
        raise UnauthorizedException("Invalid token type")

    role = payload.get("role", RoleEnum.USER)
    user_id = payload.get("user_id", None)

    if not user_id:
        raise UnauthorizedException("Invalid token payload")
    return {"user_id": user_id, "role": role}


BaseUserDep = Annotated[dict, Depends(get_current_user)]


def admin_required(user: BaseUserDep):
    if user["role"] != RoleEnum.ADMIN:
        raise PermissionDenied
    return user


def user_required(user: BaseUserDep):
    if user["role"] != RoleEnum.USER:
        raise PermissionDenied
    return user


AdminDep = Annotated[dict, Depends(admin_required)]
UserDep = Annotated[dict, Depends(user_required)]
