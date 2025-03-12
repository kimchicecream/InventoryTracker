from fastapi import APIRouter, Depends, HTTPException, Header, File, UploadFile, Request
from sqlalchemy.orm import Session
from database import get_db
from models import Part
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from aws_helper import upload_to_s3

load_dotenv()
API_KEY = os.getenv("API_KEY")


def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")

router = APIRouter(
    dependencies=[Depends(verify_api_key)]
)

# Request validations
class PartCreate(BaseModel):
    name: str
    quantity: int
    link: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    parts_per_machine: Optional[int] = None
    status: Optional[str] = "Unordered"

class PartUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    link: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    image: Optional[str] = None
    parts_per_machine: Optional[int] = None
    status: Optional[int] = None

# GET all parts
@router.get("/parts")
def get_parts(db: Session = Depends(get_db)):
    return db.query(Part).all()

# POST a new image to S3 bucket
@router.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}, Content-Type: {file.content_type}")

    image_url = upload_to_s3(file)
    return {"image_url": image_url}

# POST a new part
@router.post("/parts")
async def add_part(part: PartCreate, db: Session = Depends(get_db)):
    print("Received part data:", part.dict())

    new_part = Part(**part.dict(exclude_unset=True))
    db.add(new_part)
    db.commit()
    db.refresh(new_part)
    return new_part

# EDIT a part
@router.put("/parts/{part_id}")
def update_part(part_id: int, part_update: PartUpdate, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found, bro")

    for key, value in part_update.model_dump(exclude_unset=True).items():
        setattr(part, key, value)

    db.commit()
    db.refresh(part)
    return part

# DELETE a part
@router.delete('/parts/{part_id}')
def delete_part(part_id: int, db: Session = Depends(get_db)):
    part = db.query(Part).filter(Part.id == part_id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found, bro")

    db.delete(part)
    db.commit()
    return {"message": "Part deleted successfully"}
