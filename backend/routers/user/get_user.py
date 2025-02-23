from pydantic import BaseModel
from fastapi import APIRouter, Depends
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent

router = APIRouter()


class Response(BaseModel):
    email: str
    username: str
    id: int


@router.get("/", response_model=Response)
async def get_user(user: JWTContent = Depends(auth_middleware)):
    return Response(
        email=user.email,
        username=user.username,
        id=user.id
    )
