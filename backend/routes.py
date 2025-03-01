from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Part
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Request validations
class PartCreate(BaseModel):
    name: str
    quantity: int
    # price: float
    link: Optional[str] = None

class PartUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    link: Optional[str] = None

# GET all parts
@router.get("/parts")
def get_parts(db: Session = Depends(get_db)):
    return db.query(Part).all()

# POST a new part
@router.post("/parts")
def add_part(part: PartCreate, db: Session = Depends(get_db)):
    new_part = Part(**part.dict())
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

    for key, value in part_update.dict(exlcude_unset=True).items():
        setattr(part, key, value)

    db.commit()
    db.refresh(part)
    return part

# DELETE a part
@router.delete('/parts/{part_id}')
def delete_part(part_id: int, db: Session = Depends(get_db))
    part = db.query(Part).filter(Part.id == part.id).first()
    if not part:
        raise HTTPException(status_code=404, detail="Part not found, bro")

    db.delete(part)
    db.commit()
    return {"message": "Part deleted successfully"}
