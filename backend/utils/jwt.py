import os
import jwt
import datetime
from fastapi import HTTPException
from pydantic import BaseModel

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
EXPIRATION_IN_HOURS = 24


class JWTContent(BaseModel):
    id: int
    email: str
    username: str


def get_jwt_content(payload: dict) -> JWTContent:
    return JWTContent(**payload)


def serialize_jwt_content(content: JWTContent) -> dict:
    return content.model_dump()


def create_jwt(payload: JWTContent) -> str:
    to_encode = payload.model_dump()
    to_encode["exp"] = (
        datetime.datetime.now(datetime.timezone.utc) +
        datetime.timedelta(hours=EXPIRATION_IN_HOURS)
    )
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")


def verify_jwt(token: str) -> JWTContent:
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return get_jwt_content(decoded)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
