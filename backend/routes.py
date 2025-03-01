from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import get_db
from models import Part
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

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
    # price: float
    link: Optional[str] = None
    image: Optional[str] = None

class PartUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    link: Optional[str] = None
    image: Optional[str] = None

# GET all parts
@router.get("/parts")
def get_parts(db: Session = Depends(get_db)):
    return db.query(Part).all()

# POST a new part
@router.post("/parts")
def add_part(part: PartCreate, db: Session = Depends(get_db)):
    new_part = Part(**part.model_dump())  # ✅ Pydantic v2 fix
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
