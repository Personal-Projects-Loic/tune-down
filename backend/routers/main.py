from fastapi import APIRouter

from routers.auth.main import router as auth_router
from routers.user.main import router as user_router
from routers.wallet.main import router as wallet_router
from routers.images.main import router as images_router
main_router = APIRouter()

main_router.include_router(auth_router, prefix="/auth")
main_router.include_router(wallet_router, prefix="/wallet")
main_router.include_router(user_router, prefix="/user")
main_router.include_router(images_router, prefix="/images")
