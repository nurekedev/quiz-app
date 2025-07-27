from src.exceptions import DetailedHTTPException
from fastapi import status


class QuestionDoesNotFound(DetailedHTTPException):
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
    DETAIL = "Could not find question within the quiz"


class QuizAlreadyStarted(DetailedHTTPException):
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
    DETAIL = "You have already started quiz, finish to start a new one"


class ActiveQuizNotFound(DetailedHTTPException):
    STATUS_CODE = status.HTTP_404_NOT_FOUND
    DETAIL = "Active quiz not found for the user"
