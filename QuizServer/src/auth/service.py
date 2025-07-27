from datetime import datetime, timedelta
from typing import Optional, Any

from jose import jwt, JWTError

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select

from src.service import BaseService
from src.auth.config import settings
from src.auth.utils import (
    load_public_key,
    verify_password,
    get_password_hash,
)
from src.auth.models import (
    User,
)

from src.exceptions import NotFound

from src.auth.exceptions import (
    ConflictException,
    UnauthorizedException,
    TokenError,
)

from src.auth.utils import datetime_to_epoch, aware_utcnow


import base64
import json


class Token:

    token_type: Optional[str] = None
    lifetime: Optional[timedelta] = None

    def __init__(self, token: Optional["Token"] = None, verify: bool = True) -> None:
        if self.token_type is None or self.lifetime is None:
            raise TokenError("Cannot create token with no type or lifetime")

        self.token = token

        if token is not None:

            try:
                self.payload = jwt.decode(
                    token=str(token),
                    key=load_public_key(),
                    algorithms=[settings.ALGORITHM],
                )
            except JWTError as exp:
                raise TokenError(str(exp))

        else:
            self.payload = {settings.TOKEN_TYPE_CLAIM: self.token_type}
            self.set_exp(from_time=aware_utcnow(), lifetime=self.lifetime)
            self.set_iat(at_time=aware_utcnow())

    def __repr__(self) -> str:
        return repr(self.payload)

    def __getitem__(self, key: str):
        return self.payload[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.payload[key] = value

    def __delitem__(self, key: str) -> None:
        del self.payload[key]

    def __contains__(self, key: str) -> Any:
        return key in self.payload

    def get(self, key: str, default: Optional[Any] = None) -> Any:
        return self.payload.get(key, default)

    def __str__(self):
        payload_str = json.dumps(self.payload)
        base64_encoded = base64.b64encode(payload_str.encode("utf-8"))
        return base64_encoded.decode("utf-8")

    def set_exp(
        self,
        claim: str = "exp",
        from_time: Optional[datetime] = None,
        lifetime: Optional[timedelta] = None,
    ) -> None:

        if from_time is None:
            from_time = aware_utcnow()

        if lifetime is None:
            lifetime = self.lifetime

        self.payload[claim] = datetime_to_epoch(from_time + lifetime)

    def set_iat(self, claim: str = "iat", at_time: Optional[datetime] = None) -> None:
        if at_time is None:
            at_time = aware_utcnow()

        self.payload[claim] = datetime_to_epoch(at_time)

    @classmethod
    def for_user(cls, user: User) -> "Token":
        user_id = getattr(user, "id")
        if not isinstance(user_id, int):
            user_id = str(user_id)

        user_role = getattr(user, "role")

        token = cls()
        token["user_id"] = user_id
        token["role"] = user_role

        return token


class AccessToken(Token):
    token_type = "access"
    lifetime = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)


class RefreshToken(Token):
    token_type = "refresh"
    lifetime = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    no_copy_claims = (
        "exp",
        "token_type",
    )
    access_token_class = AccessToken

    @property
    def access_token(self) -> AccessToken:
        access = self.access_token_class()
        access.set_exp(from_time=aware_utcnow())

        no_copy = self.no_copy_claims
        for claim, value in self.payload.items():
            if claim in no_copy:
                continue
            access[claim] = value

        return access

    @classmethod
    def for_user(cls, user: User) -> "Token":
        token = super().for_user(user)

        return token


class UserService(BaseService):
    model = User

    @classmethod
    async def get_by_id(cls, session: AsyncSession, instance_id: int):
        stmt = select(cls.model).where(cls.model.id == instance_id)
        result = await session.execute(stmt)
        instance = result.scalar_one_or_none()
        if not instance:
            raise NotFound
        return instance

    @classmethod
    async def create(cls, session: AsyncSession, data: Any):
        hashed_password = get_password_hash(password=data.password)

        try:
            new_user = User(
                username=data.username,
                hashed_password=hashed_password,
                full_name=data.full_name,
            )

            session.add(new_user)
            await session.commit()
            await session.refresh(new_user)
            return new_user
        except IntegrityError as exp:
            await session.rollback()
            integrity_error_key = "username"
            raise ConflictException(
                f"User with {integrity_error_key} {getattr(data, integrity_error_key)} already exists"
            ) from exp

    @classmethod
    async def get_by_credentials(
        cls, session: AsyncSession, username: str, password: str
    ):
        result = await session.execute(
            select(cls.model).where(cls.model.username == username)
        )
        user = result.scalar_one_or_none()

        if not user or not verify_password(password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")
        if not user.is_active:
            raise UnauthorizedException("User is inactive")
        return user
