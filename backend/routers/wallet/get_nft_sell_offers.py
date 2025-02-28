from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from pydantic import BaseModel, field_validator

from db.database import get_db, AsyncSession
from db.helpers import db_get_user
from middlewares.auth import auth_middleware
from routers.validators import validate_token_id
from utils.jwt import JWTContent
from utils.xrpl.create_offer import NFTOffer
from utils.xrpl.get_offers import xrpl_get_sell_offers
from utils.xrpl.helpers import xrpl_verify_secret_with_address

router = APIRouter()


class Request(BaseModel):
    nft_id: str

    @field_validator("nft_id")
    def validate_nft_id(cls, value):
        return validate_token_id(value)


async def verify_secret(wallet_secret: str, user_id: int, db: AsyncSession):
    db_user = await db_get_user(db, user_id)
    return xrpl_verify_secret_with_address(wallet_secret, db_user.wallet_id)


@router.post("/get_nft_sell_offer", response_model=list[NFTOffer])
async def add_wallet(
    request: Request,
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db),
):
    return await xrpl_get_sell_offers(
        nft_id=request.nft_id
    )
