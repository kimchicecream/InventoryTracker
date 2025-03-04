import boto3
import os
from uuid import uuid4
from dotenv import load_dotenv
from pathlib import Path

# Load .env from the backend directory
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(ENV_PATH)

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")

if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET]):
    raise ValueError("AWS environment variables are missing or incorrectly set.")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def upload_to_s3(file):
    # """Uploads a file to S3 and returns the public file URL"""
    if not file:
        raise ValueError("No file provided for upload.")

    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid4()}.{file_extension}"

    print(f"Uploading {file.filename} to S3 as {unique_filename}")

    s3_client.upload_fileobj(
        file.file,
        AWS_S3_BUCKET,
        unique_filename,
        ExtraArgs={"ContentType": file.content_type}
    )

    image_url = f"https://{AWS_S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{unique_filename}"
    # print(f"Uploaded image URL: {image_url}")

    return image_url
