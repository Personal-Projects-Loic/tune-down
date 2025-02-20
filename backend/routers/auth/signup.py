from pydantic import BaseModel, field_validator
from fastapi import APIRouter, Depends, HTTPException
from routers.schemas import BaseResponse
from routers.validators import validate_password

router = APIRouter()

class Request(BaseModel):
    email: str
    password: str

    @field_validator('password')
    def password_validation(cls, v):
        return validate_password(v)

class Response(BaseResponse):
    pass

@router.post("/signup", response_model=Response)
async def signup(request: Request):
    raise HTTPException(status_code=400, detail="Username or email already registered")
    return Response(message="User created successfully")

