from fastapi import APIRouter
from routers.auth.signup import router as signup_router
from pydantic import ValidationError
from fastapi.responses import JSONResponse

router = APIRouter()

router.include_router(signup_router)