from fastapi import APIRouter, Depends
from typing import Optional

from db.database import get_db, AsyncSession
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent

router = APIRouter()


class Response:
    pass


class Request:
    nft_id: str
    wallet_id: Optional[str]
    price: int


@router.post("/create_nft_sell_offer", response_model=Response)
async def add_wallet(
    request: Request,
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db),
):
    pass