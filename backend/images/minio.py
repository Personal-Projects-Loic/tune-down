from minio import Minio
import os


def minio_client():
    return Minio(
        endpoint=os.getenv("MINIO_HOST", "minio") + ":" +
        os.getenv("MINIO_PORT", "9000"),
        access_key=os.getenv("MINIO_ROOT_USER", "tunedown"),
        secret_key=os.getenv("MINIO_ROOT_PASSWORD", "tunedownPassword"),
        secure=os.getenv("MINIO_SECURE", "False").lower() == "true"
    )


def test_bucket():
    bucket_name = "nft-tests"
    minio = minio_client()
    try:
        found = minio.bucket_exists(bucket_name)
        if not found:
            minio.make_bucket(bucket_name)
    except Exception as e:
        print(e)

