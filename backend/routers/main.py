from fastapi import APIRouter

from routers.auth.main import router as auth_router
from routers.user.main import router as user_router

main_router = APIRouter()

main_router.include_router(auth_router, prefix="/auth")
main_router.include_router(user_router, prefix="/user")