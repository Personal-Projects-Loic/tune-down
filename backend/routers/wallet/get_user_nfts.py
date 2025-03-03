from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Annotated, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from utils.jwt import JWTContent
from middlewares.auth import auth_middleware
from db.database import get_db
from utils.xrpl.get_nft import NFTGetter, NFTInfos
from db.models import NFT

router = APIRouter()


class Request(BaseModel):
    page: int
    limit: int
    user_id: Optional[int] = None


class Response(BaseModel):
    nft_infos: NFTInfos
    price: Optional[int]


async def db_get_nfts(db: AsyncSession, user_id: int):
    query = select(NFT).options(selectinload(NFT.user))\
        .filter(NFT.user_id == user_id)

    result = await db.execute(query)
    nfts = result.scalars().all()
    return nfts


async def batch_get_nfts(db_nfts: list[NFT]):
    res = []
    nft_getter = NFTGetter()
    for db_nft in db_nfts:
        nft = await nft_getter.xrpl_get_nft(
            db_nft.nft_id,
            db_nft.wallet_id
        )
        if nft:
            res.append(nft)
    return res


@router.get("/user_nfts", response_model=list[Response])
async def list_nfts(
    Request: Annotated[Request, Query()],
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    user_id = Request.user_id
    if user_id is None:
        user_id = user.id

    db_nfts = await db_get_nfts(db, user_id)
    nfts = await batch_get_nfts(db_nfts)
    response = [
        Response(
            nft_infos=nft,
            price=db_nfts[i].price,
        ) for i, nft in enumerate(nfts)
    ]
    return response
