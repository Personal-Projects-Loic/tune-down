from fastapi import Depends, HTTPException, APIRouter
from fastapi.responses import StreamingResponse


from typing import Optional
from middlewares.auth import auth_middleware
from db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from utils.jwt import JWTContent
from images.minio import minio_client, Minio
import io
from db.helpers import db_get_user


router = APIRouter()


@router.get("/get_nft_picture")
async def get_nft_picture(
    bucket_name: str,
    object_name: str,
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db),
    download: Optional[bool] = False,
    minio_client: Minio = Depends(minio_client)
):
    user = await db_get_user(db, user.id)
    try:
        # Check if the bucket exists
        if not minio_client.bucket_exists(bucket_name):
            raise HTTPException(
                status_code=404, 
                detail=f"Bucket '{bucket_name}' not found"
            )
        # Get object data
        response = minio_client.get_object(bucket_name, object_name)
        # Determine content type from object metadata
        content_type = response.headers.get(
            'Content-Type',
            'application/octet-stream'
        )
        # Check if it's an image based on content type
        if not content_type.startswith('image/'):
            response.close()
            raise HTTPException(
                status_code=400, 
                detail=f"Object is not an image (Content-Type: {content_type})"
            )
        # Read the data
        data = response.read()
        response.close()
        # Set up response headers
        headers = {}
        if download:
            filename = object_name.split('/')[-1]
            headers["Content-Disposition"] = f'attachment; filename="{filename}"'
        else:
            headers["Content-Disposition"] = "inline"
        # Return the image as a streaming response
        return StreamingResponse(
            io.BytesIO(data),
            media_type=content_type,
            headers=headers
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to retrieve image: {str(e)}"
        )