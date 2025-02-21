from fastapi import APIRouter, Depends

from middlewares.auth import auth_middleware
from routers.images.upload_picture import router as upload_image_router

router = APIRouter(
    dependencies=[Depends(auth_middleware)]
)

router.include_router(upload_image_router)