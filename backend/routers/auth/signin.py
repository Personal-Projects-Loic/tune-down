from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import status

from db.models import User
from db.database import get_db
from utils.password import verify_password
from utils.jwt import create_jwt, JWTContent

GENERAL_ERROR = "Invalid email/username or password"

router = APIRouter()


class Request(BaseModel):
    email_or_username: str
    password: str


class Response(BaseModel):
    access_token: str = None


async def db_get_user(db: AsyncSession, email_or_username: str):
    query = select(User).filter(
        (User.email == email_or_username) |
        (User.username == email_or_username)
    )
    users = await db.execute(query)
    user = users.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=GENERAL_ERROR
        )
    return user


@router.post("/signin", response_model=Response)
async def signin(request: Request, db: AsyncSession = Depends(get_db)):
    user = await db_get_user(db, request.email_or_username)
    if not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=GENERAL_ERROR
        )

    jwt_content = JWTContent(
        email=user.email,
        id=user.id,
        username=user.username
    )
    access_token = create_jwt(jwt_content)
    return Response(access_token=access_token)
