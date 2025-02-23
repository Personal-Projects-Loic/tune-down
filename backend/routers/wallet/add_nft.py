from fastapi import UploadFile, APIRouter, File, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from db.helpers import db_get_user
from middlewares.auth import auth_middleware
from db.database import get_db
from utils.jwt import JWTContent
from utils.xrpl.create_nft import xrpl_create_nft, NFTCreateResponse
from db.models import NFT
from images.minio import minio_client, Minio
import os
import io
import uuid
from datetime import datetime


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


async def upload_nft_picture(
    file: UploadFile = File(...),
    minio: Minio = Depends(minio_client)
):
    try:
        content_type = file.content_type
        if content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only images are allowed"
            )

        file_data = await file.read()
        file_size = len(file_data)

        if file_size <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Empty file"
            )

        # Generate a unique filename
        file_extension = os.path.splitext(file.filename)[1]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4().hex[:8])
        new_filename = f"{timestamp}_{unique_id}{file_extension}"

        # Upload the file to Minio
        file_object = io.BytesIO(file_data)
        minio.put_object(
            "nft-tests",
            new_filename,
            file_object,
            file_size,
            content_type=content_type
        )

        url = f"http://minio:9000/nft-tests/{new_filename}"

        # return JSONResponse(
        #     status_code=201,
        #     content={
        #         "message": "Picture uploaded successfully",
        #         "filename": new_filename,
        #         "original_filename": file.filename,
        #         "size": file_size,
        #         "content_type": content_type,
        #         "object_name": new_filename,
        #         "url": url
        #     }
        # )
        return url
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error uploading file: {str(e)}"
        )


@router.post("/add_nft", response_model=NFTCreateResponse)
async def add_wallet(
    wallet_secret: str,
    name: str,
    collection: str,
    file: UploadFile = File(...),
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db),
    minio: Minio = Depends(minio_client)
):
    user = await db_get_user(db, user.id)
    link = await upload_nft_picture(file, minio)

    xrpl_res = await xrpl_create_nft(wallet_secret, link)
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
    return (xrpl_res)
