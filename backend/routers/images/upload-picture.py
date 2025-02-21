from fastapi import UploadFile, File, HTTPException, Depends, APIRouter, status
from fastapi.responses import JSONResponse
from minio.minio import minio_client, Minio
import os
import io
import uuid
from datetime import datetime

router = APIRouter()


@router.post("/upload-picture/")
async def upload_picture(
    file: UploadFile = File(...),
    minion_client: Minio = Depends(minio_client),    
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
        minio_client.put_object(
            "nft-tests",
            new_filename,
            file_object,
            file_size,
            content_type=content_type
        )

        url = f"http://minio:9000/nft-tests/{new_filename}"
        
        return JSONResponse(
            status_code=201,
            content={
                "message": "Picture uploaded successfully",
                "filename": new_filename,
                "original_filename": file.filename,
                "size": file_size,
                "content_type": content_type,
                "object_name": new_filename,
                "url": url
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error uploading file: {str(e)}"
        )