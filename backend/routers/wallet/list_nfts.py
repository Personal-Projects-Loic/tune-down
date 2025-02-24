from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql.elements import ColumnElement
from sqlalchemy import or_, and_
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from utils.jwt import JWTContent
from middlewares.auth import auth_middleware
from db.database import get_db
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


class User(BaseModel):
    username: str


class Response(BaseModel):
    nft_infos: NFTInfos
    user: User


def db_get_filter_condition(
    request: Request,
    request_field: str,
    db_field: ColumnElement
):
    field_value = getattr(request, f"{request_field}_filter")
    if not field_value:
        return None
    filter_condition = db_field.ilike(f"%{field_value}%")
    return filter_condition


def db_get_filters(request: Request) -> Tuple[list, list]:
    excl = []
    incl = []

    for i in FILTERS:
        filter_condition = db_get_filter_condition(request, *i)
        if filter_condition is None:
            continue
        if getattr(request, f"{i[0]}_filter_exclusive"):
            excl.append(filter_condition)
        else:
            incl.append(filter_condition)
    return (excl, incl)


async def db_get_nfts(db: AsyncSession, request: Request):
    excl, incl = db_get_filters(request)
    query = select(NFT).options(selectinload(NFT.user))

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
            db_nft.wallet_id
        )
        if nft:
            res.append(nft)
    return res


@router.post("/list", response_model=list[Response])
async def list_nfts(
    Request: Request,
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    db_nfts = await db_get_nfts(db, Request)
    print(db_nfts)
    nfts = await batch_get_nfts(db_nfts)
    response = [
        Response(
            nft_infos=nft,
            user=User(username=db_nfts[i].user.username)
        ) for i, nft in enumerate(nfts)
    ]
    return response
