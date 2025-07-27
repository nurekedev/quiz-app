from starlette import status

from src.exceptions import DetailedHTTPException


class UnauthorizedException(DetailedHTTPException):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = "Unauthorized access"

    def __init__(self, detail: str = None):
        super().__init__(detail=detail or self.DETAIL, status_code=self.STATUS_CODE)


class ConflictException(DetailedHTTPException):
    STATUS_CODE = status.HTTP_409_CONFLICT
    DETAIL = "Conflict occurred"

    def __init__(self, detail: str = None):
        super().__init__(detail=detail or self.DETAIL, status_code=self.STATUS_CODE)


class TokenError(DetailedHTTPException):
    STATUS_CODE = status.HTTP_401_UNAUTHORIZED
    DETAIL = "Token error"

    def __init__(self, detail: str = None):
        super().__init__(detail=detail or self.DETAIL, status_code=self.STATUS_CODE)
