from typing import Annotated
from fastapi import APIRouter, File, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from db.helpers import db_get_user
from middlewares.auth import auth_middleware
from db.database import get_db
from utils.jwt import JWTContent
from utils.xrpl.create_nft import xrpl_create_nft, NFTCreateResponse
from utils.xrpl.helpers import xrpl_verify_secret_with_address
from db.models import NFT

router = APIRouter()
TEMP_LINK = (
    "https://yt3.googleusercontent.com/bZ_SbVBaTDsmrkvA-"
    "37D0NHYC8z2v2A0GN2S89IORhDxeeuM6JY58_dsUJNvTAmi2Ex"
    "U7vJWuA=s900-c-k-c0x00ffffff-no-rj"
)


async def db_create_nft(
    db: AsyncSession,
    nft: NFT
):
    db.add(nft)
    try:
        await db.commit()
        await db.refresh(nft)
        return nft
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error adding up NFT to the database"
        )


@router.post("/add_nft", response_model=NFTCreateResponse)
async def add_wallet(
    wallet_secret: str,
    name: str,
    collection: str,
    file: Annotated[bytes, File()],
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    user = await db_get_user(db, user.id)
    xrpl_verify_secret_with_address(wallet_secret, user.wallet_id)
    # add image to bucket and get the link
    link = TEMP_LINK
    xrpl_res = await xrpl_create_nft(wallet_secret, link)
    await db_create_nft(
        db,
        nft=NFT(
            nft_id=xrpl_res.nft.id,
            name=name,
            collection=collection,
            user=user.id,
            wallet_id=user.wallet_id
        )
    )
    return (xrpl_res)
