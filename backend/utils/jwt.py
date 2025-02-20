import os
import jwt
import datetime
from fastapi import HTTPException

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
EXPIRATION_IN_HOURS = 24


def create_jwt(payload: dict) -> str:
    to_encode = payload.copy()
    to_encode["exp"] = (
        datetime.datetime.now(datetime.timezone.utc) +
        datetime.timedelta(hours=EXPIRATION_IN_HOURS)
    )
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
