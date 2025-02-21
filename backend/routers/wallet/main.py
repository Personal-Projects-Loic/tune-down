from fastapi import APIRouter, Depends

from middlewares.auth import auth_middleware
from routers.wallet.add_wallet import router as add_wallet_router

router = APIRouter(
    dependencies=[Depends(auth_middleware)]
)

router.include_router(add_wallet_router, prefix="/add_wallet")
