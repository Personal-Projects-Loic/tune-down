from typing import Annotated
from fastapi import APIRouter, File, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.helpers import db_get_user
from middlewares.auth import auth_middleware
from db.database import get_db
from utils.jwt import JWTContent
from utils.xrpl.create_nft import xrpl_create_nft, NFTCreateResponse
from utils.xrpl.helpers import xrpl_verify_secret_with_address

router = APIRouter()
TEMP_LINK = (
    "https://yt3.googleusercontent.com/bZ_SbVBaTDsmrkvA-"
    "37D0NHYC8z2v2A0GN2S89IORhDxeeuM6JY58_dsUJNvTAmi2Ex"
    "U7vJWuA=s900-c-k-c0x00ffffff-no-rj"
)


@router.post("/add_nft", response_model=NFTCreateResponse)
async def add_wallet(
    wallet_secret: str,
    collection: str,
    file: Annotated[bytes, File()],
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    user = await db_get_user(db, user.id)
    # add image to bucket and get the link
    xrpl_verify_secret_with_address(wallet_secret, user.wallet_id)
    link = TEMP_LINK
    return (
        await xrpl_create_nft(wallet_secret, link)
    )
