from fastapi import APIRouter

from routers.auth.signup import router as signup_router
from routers.auth.signin import router as signin_router

router = APIRouter()

router.include_router(signup_router)
router.include_router(signin_router)
