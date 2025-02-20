from fastapi import APIRouter

from routers.auth.main import router as signup_router

main_router = APIRouter()

main_router.include_router(signup_router, prefix="/auth")