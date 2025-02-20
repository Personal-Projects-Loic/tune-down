from pydantic import BaseModel, field_validator
from fastapi import APIRouter, Depends, HTTPException
from routers.validators import (
    validate_password,
    validate_email,
    validate_username
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import status

from db.models import User
from db.database import get_db
from utils.password import hash_password
from utils.jwt import create_jwt

router = APIRouter()


class Request(BaseModel):
    email: str
    username: str
    password: str

    @field_validator('password')
    def password_validation(cls, v):
        return validate_password(v)

    @field_validator('email')
    def email_validation(cls, v):
        return validate_email(v)

    @field_validator('username')
    def username_validation(cls, v):
        return validate_username(v)


class Response(BaseModel):
    access_token: str = None
    pass


async def db_create_user(db: AsyncSession, request: Request):
    crypted_passwd = hash_password(request.password)
    new_user = User(
        email=request.email,
        username=request.username,
        password=crypted_passwd
    )
    db.add(new_user)
    try:
        await db.commit()
        await db.refresh(new_user)
        return new_user
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already exists"
        )


@router.post("/signup", response_model=Response)
async def signup(request: Request, db: AsyncSession = Depends(get_db)):
    new_user = await db_create_user(db, request)
    print(new_user)
    token_payload = create_jwt({
        "email": request.email,
        "username": request.username,
        "id": new_user.id
    })
    return Response(access_token=token_payload)
