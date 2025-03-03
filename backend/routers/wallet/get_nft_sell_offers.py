from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, field_validator

from middlewares.auth import auth_middleware
from typing import Annotated
from routers.validators import validate_token_id
from utils.jwt import JWTContent
from utils.xrpl.create_offer import NFTOffer
from utils.xrpl.get_offers import xrpl_get_sell_offers

router = APIRouter()


class Request(BaseModel):
    nft_id: str

    @field_validator("nft_id")
    def validate_nft_id(cls, value):
        return validate_token_id(value)


@router.get("/get_nft_sell_offer", response_model=list[NFTOffer])
async def get_nft_sell_offer(
    request: Annotated[Request, Query()],
    _: JWTContent = Depends(auth_middleware),
):
    return await xrpl_get_sell_offers(
        nft_id=request.nft_id
    )
