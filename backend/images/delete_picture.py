from fastapi import Depends, HTTPException, status
from images.minio import minio_client, Minio, buckets


async def delete_picture(
    filename: str,
    minio: Minio = Depends(minio_client)
):
    print("delete_picture", filename)
    try:
        bucket_name = buckets['nft-tests']
        if not minio.bucket_exists(bucket_name):
            print(f"Bucket '{bucket_name}' does not exist.")
            return False

        try:
            minio.stat_object(bucket_name, filename)
        except Exception:
            print(f"Object '{filename}' not found in '{bucket_name}'.")
            return False

        minio.remove_object(bucket_name, filename)
        print(f"Successfully deleted '{filename}' from '{bucket_name}'.")
        return True

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )
