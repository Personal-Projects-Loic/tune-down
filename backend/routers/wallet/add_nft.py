from fastapi import (
    UploadFile,
    APIRouter,
    File,
    Depends,
    HTTPException,
    status,
    Form
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi.responses import JSONResponse
from db.helpers import db_get_user
from middlewares.auth import auth_middleware
from db.database import get_db
from utils.jwt import JWTContent
from utils.xrpl.create_nft import xrpl_create_nft
from db.models import NFT
from images.minio import minio_client, Minio
from images.upload_picture import upload_picture

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


@router.post(
    "/add_nft",
    responses={
        401: {
            "description": "wallet not found"
        },
        500: {
            "description": "Error adding NFT"
        },
        406: {
            "description": "invalid wallet secret"
        }

    }
)
async def add_nft(
    wallet_secret: str = Form(...),
    name: str = Form(...),
    collection: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db),
    minio: Minio = Depends(minio_client)
):
    try:
        user = await db_get_user(db, user.id)
        link = await upload_picture(file, minio)

        xrpl_res = await xrpl_create_nft(wallet_secret, link)
        # Check if xrpl_create_nft returned an error
        if isinstance(xrpl_res, dict) and xrpl_res.get("success") is False:
            return JSONResponse(
                status_code=406,
                content=xrpl_res
            )
        # If we got here, the NFT creation was successful
        await db_create_nft(
            db,
            nft=NFT(
                nft_id=xrpl_res.nft.id,
                name=name,
                collection=collection,
                user_id=user.id,
                wallet_id=user.wallet_id
            )
        )
        return xrpl_res
    except Exception as e:
        # Handle any other exceptions that might occur
        error_message = str(e)
        print(f"Error in add_nft: {error_message}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Failed to add NFT",
                "details": error_message
            }
        )
