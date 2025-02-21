from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.elements import ColumnElement
from sqlalchemy import or_, and_
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.sql.selectable import Select

from utils.jwt import JWTContent
from middlewares.auth import auth_middleware
from db.database import get_db
from db.helpers import db_get_user
from utils.xrpl.get_nft import NFTGetter, NFTInfos
from db.models import NFT

FILTERS = [
    ("id", NFT.nft_id),
    ("name", NFT.name),
    ("collection", NFT.collection)
]

router = APIRouter()


class Request(BaseModel):
    id_filter: Optional[str] = None
    id_filter_exclusive: Optional[bool] = None

    name_filter: Optional[str] = None
    name_filter_exclusive: Optional[bool] = None

    collection_filter: Optional[str] = None
    collection_filter_exclusive: Optional[bool] = None

    page: Optional[int] = 0
    limit: Optional[int] = 10


class Response(BaseModel):
    nft_infos: NFTInfos


def get_filter_condition(
    request: Request,
    request_field: str,
    db_field: ColumnElement
):
    field_value = getattr(request, f"{request_field}_filter")
    if not field_value:
        return None
    filter_condition = db_field.ilike(f"%{field_value}%")
    # if getattr(request, f"{request_field}_filter_exclusive"):
    #     return and_(query, filter_condition)
    # return or_(query, filter_condition)
    return filter_condition


async def db_get_nfts(db: AsyncSession, request: Request):
    query = select(NFT).options(selectinload(NFT.user))
    excl = []
    incl = []

    for i in FILTERS:
        filter_condition = get_filter_condition(request, *i)
        if filter_condition is None:
            continue
        if getattr(request, f"{i[0]}_filter_exclusive"):
            excl.append(filter_condition)
        else:
            incl.append(filter_condition)
    inner_query = and_(*excl)
    inner_query = or_(inner_query, *incl)

    query = query.filter(inner_query)
    offset = (request.page) * request.limit
    query = query.offset(offset).limit(request.limit)
    result = await db.execute(query)
    nfts = result.scalars().all()
    return nfts


async def batch_get_nfts(db_nfts: list[NFT]):
    res = []
    nft_getter = NFTGetter()
    for db_nft in db_nfts:
        nft = await nft_getter.xrpl_get_nft(
            db_nft.nft_id,
            db_nft.user.wallet_id
        )
        res.append(nft)
    # print("res", res)
    return res


@router.post("/list", response_model=list[Response])
async def list_nfts(
    Request: Request,
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    db_nfts = await db_get_nfts(db, Request)
    print("db_nfts")
    nfts = await batch_get_nfts(db_nfts)
    response = [Response(nft_infos=i) for i in nfts]
    return response
