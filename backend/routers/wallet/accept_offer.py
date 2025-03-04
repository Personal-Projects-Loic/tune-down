from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from db.database import get_db, AsyncSession
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent
from utils.xrpl.accept_offer import xrpl_accept_offer

router = APIRouter()


class Request(BaseModel):
    private_key: str
    sell_offer_id: Optional[str] = None
    buy_offer_id: Optional[str] = None


class Response(BaseModel):
    success: bool


@router.post("/accept_offer", response_model=Response)
async def accept_offer(
    request: Request,
    db: AsyncSession = Depends(get_db),
    _: JWTContent = Depends(auth_middleware),
):
    nft_id = await xrpl_accept_offer(
        private_key=request.private_key,
        nft_id=request.nft_id,
        sell_offer_id=request.sell_offer_id,
        buy_offer_id=request.buy_offer_id,
    )

    # TODO : Change db to change the owner of the nft
    # await db_update_nft_owner(db, nft_id, request.user_id)

    Response(success=True)
