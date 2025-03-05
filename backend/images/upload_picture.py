from fastapi import UploadFile, File, Depends, HTTPException, status
from images.minio import minio_client, Minio, buckets
import os
import io
import uuid
from datetime import datetime


async def upload_picture(
    file: UploadFile = File(...),
    minio: Minio = Depends(minio_client),
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

        # Génération d'un nom de fichier unique
        file_extension = os.path.splitext(file.filename or "")[1]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4().hex[:8])
        new_filename = f"{timestamp}_{unique_id}{file_extension}"

        # Upload du fichier sur Minio
        file_object = io.BytesIO(file_data)
        bucket_name = buckets['nft-tests']
        minio.put_object(
            bucket_name,
            new_filename,
            file_object,
            file_size,
            content_type=content_type
        )
        print(f"Uploaded file to Minio: {new_filename}")
        endpoint = os.getenv("MINIO_ENDPOINT", "localhost:9000")

        # Construct direct URL based on public bucket policy
        url = f"http://{endpoint}/{bucket_name}/{new_filename}"
        return {
            "status": "success",
            "status_code": 200,
            "url": url
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )
