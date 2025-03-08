from fastapi import APIRouter, Depends
from pydantic import BaseModel, field_validator
from middlewares.auth import auth_middleware
from routers.validators import validate_token_id
from utils.jwt import JWTContent
from utils.xrpl.create_offer import xrpl_create_offer
from utils.xrpl.helpers import xrpl_verify_secret_with_address
from db.helpers import db_get_user
from db.database import get_db, AsyncSession

router = APIRouter()


class Response(BaseModel):
    account: str
    nft_id: str
    price: float
    is_sell_offer: bool
    offer_id: str


class Request(BaseModel):
    nft_id: str
    nft_owner: str
    wallet_private_key: str
    price: float

    @field_validator("nft_id")
    def validate_nft_id(cls, v):
        return validate_token_id(v)


async def verify_secret(wallet_secret: str, user_id: int, db: AsyncSession):
    db_user = await db_get_user(db, user_id)
    return xrpl_verify_secret_with_address(wallet_secret, db_user.wallet_id)


@router.post("/create_nft_buy_offer", response_model=Response)
async def create_nft_buy_offer(
    request: Request,
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    await verify_secret(request.wallet_private_key, user.id, db)

    xrpl_res = await xrpl_create_offer(
        amount=request.price,
        is_sell_offer=False,
        nft_id=request.nft_id,
        owner=request.nft_owner,
        wallet_seed=request.wallet_private_key
    )

    return Response(**xrpl_res.model_dump())
