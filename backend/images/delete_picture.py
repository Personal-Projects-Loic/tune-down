from fastapi import Depends, HTTPException, status
from images.minio import minio_client, Minio, buckets


async def delete_picture(
    filename: str,
    minio: Minio = Depends(minio_client)
):
    try:
        if not minio.bucket_exists(buckets['nft-tests']):
            print(f"Bucket '{buckets['nft-tests']}' does not exist.")
            return False
        # Check if object exists before attempting to delete
        try:
            minio.stat_object(buckets['nft-tests'], filename)
        except Exception as err:
            if err.code == 'NoSuchKey':
                print(
                    f"Object '{filename}' does not exist in bucket '{
                        buckets['nft-tests']
                    }'."
                )
                return False
            raise  # Re-raise other errors
        # Delete the object
        minio.remove_object(buckets['nft-tests'], filename)
        print(
            f"Successfully deleted '{filename}' from bucket '{
                buckets['nft-tests']
            }'."
        )
        return True
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting file: {str(e)}"
        )
