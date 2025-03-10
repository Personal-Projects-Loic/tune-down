from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.future import select
from pydantic import BaseModel, field_validator

from db.database import get_db, AsyncSession
from db.helpers import db_get_user
from db.models import NFT
from middlewares.auth import auth_middleware
from routers.validators import validate_token_id
from utils.jwt import JWTContent
from utils.xrpl.create_offer import xrpl_create_offer
from utils.xrpl.helpers import xrpl_verify_secret_with_address

router = APIRouter()


class Response(BaseModel):
    account: str
    nft_id: str
    price: float
    is_sell_offer: bool
    offer_id: str


class Request(BaseModel):
    nft_id: str
    wallet_private_key: str
    price: float

    @field_validator("nft_id")
    def validate_nft_id(cls, v):
        return validate_token_id(v)


async def verify_secret(wallet_secret: str, user_id: int, db: AsyncSession):
    db_user = await db_get_user(db, user_id)
    return xrpl_verify_secret_with_address(wallet_secret, db_user.wallet_id)


async def db_add_price(db: AsyncSession, nft_id: str, price: int):
    result = await db.execute(
        select(NFT).filter(NFT.nft_id == nft_id)
    )
    nft = result.scalar_one_or_none()
    if not nft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    nft.price = price
    try:
        await db.commit()
        await db.refresh(nft)
        return nft
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update wallet_id due to integrity error"
        )


@router.post("/create_nft_sell_offer", response_model=Response)
async def add_wallet(
    request: Request,
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db),
):
    await verify_secret(request.wallet_private_key, user.id, db)
    xrpl_res = await xrpl_create_offer(
        amount=request.price,
        is_sell_offer=True,
        nft_id=request.nft_id,
        wallet_seed=request.wallet_private_key
    )

    await db_add_price(db, request.nft_id, request.price)

    return Response(**xrpl_res.model_dump())
