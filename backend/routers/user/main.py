from fastapi import APIRouter, Depends

from routers.user.get_user import router as get_user_router
from middlewares.auth import auth_middleware

router = APIRouter(
    dependencies=[Depends(auth_middleware)]
)
router.include_router(get_user_router)
