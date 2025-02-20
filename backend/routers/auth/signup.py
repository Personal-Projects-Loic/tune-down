from pydantic import BaseModel, field_validator
from fastapi import APIRouter, Depends, HTTPException
from routers.schemas import BaseResponse
from routers.validators import validate_password, validate_email, validate_username
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import status

from db.models import User
from db.database import get_db

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


class Response(BaseResponse):
    pass

async def db_create_user(db: AsyncSession, request: Request):
    new_user = User(email=request.email, username=request.username, password=request.password)
    db.add(new_user)
    try:
        await db.commit()
        await db.refresh(new_user)
    except IntegrityError:
        print(IntegrityError)
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or username already exists")

@router.post("/signup", response_model=Response)
async def signup(request: Request, db: AsyncSession = Depends(get_db)):
    await db_create_user(db, request)
    return Response(message="User created successfully")