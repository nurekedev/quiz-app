from datetime import datetime, timezone
from calendar import timegm

from passlib.context import CryptContext
from src.auth.config import settings
import bcrypt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_byte_enc = plain_password.encode("utf-8")
    return bcrypt.checkpw(
        password=password_byte_enc, hashed_password=hashed_password.encode("utf-8")
    )


def get_password_hash(password: str):
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password.decode("utf-8")


def load_private_key() -> str:
    with open(settings.PRIVATE_KEY_PATH, "r", encoding="utf-8") as file:
        return file.read()


def load_public_key() -> str:
    with open(settings.PUBLIC_KEY_PATH, "r", encoding="utf-8") as file:
        return file.read()


def aware_utcnow() -> datetime:
    dt = datetime.now(tz=timezone.utc)
    return dt


def datetime_to_epoch(dt: datetime):
    return timegm(dt.utctimetuple())


def datetime_from_epoch(ts: float) -> datetime:
    dt = datetime.fromtimestamp(ts, tz=timezone.utc)
    return dt
