from fastapi import UploadFile, APIRouter, File, Depends, HTTPException, status
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent
from images.minio import minio_client, Minio, buckets
import os
import io
import uuid
from datetime import datetime


router = APIRouter()


@router.post("/upload_picture")
async def upload_picture(
    file: UploadFile = File(...),
    minio: Minio = Depends(minio_client),
    _: JWTContent = Depends(auth_middleware)
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
        bucket_name = buckets['nft-tests']
        minio.put_object(
            bucket_name,
            new_filename,
            file_object,
            file_size,
            content_type=content_type
        )

        # Generate the correct URL format for MinIO
        # This assumes MinIO is configured with a proper endpoint
        url = minio.presigned_get_object(bucket_name, new_filename)
        return {"url": url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )
