import json
from minio import Minio
import os


buckets = {
    "nft-tests": "nft-tests",
    "nft": "nft",
    "profile-pictures": "profile-pictures",
}


def minio_client():
    return Minio(
        endpoint=os.getenv("MINIO_HOST", "minio") + ":" +
        os.getenv("MINIO_PORT", "9000"),
        access_key=os.getenv("MINIO_ROOT_USER", "tunedown"),
        secret_key=os.getenv("MINIO_ROOT_PASSWORD", "tunedownPassword"),
        secure=os.getenv("MINIO_SECURE", "False").lower() == "true"
    )


def test_bucket():
    minio = minio_client()
    try:
        found = minio.bucket_exists(buckets["nft-tests"])
        if not found:
            minio.make_bucket(buckets["nft-tests"])
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": ["*"]},
                    "Action": ["s3:GetObject"],
                    "Resource": [f"arn:aws:s3:::{buckets['nft-tests']}/*"]
                }
            ]
        }
        # Convert the policy dictionary to a JSON string
        policy_json = json.dumps(policy)
        minio.set_bucket_policy(buckets["nft-tests"], policy_json)
    except Exception as e:
        print(e)
