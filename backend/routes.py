from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Part
from pydantic import BaseModel

router = APIRouter()

# Request validation
class PartCreate(BaseModel):
    name: str
    quantity: int
    price: float
    link: str | None = None

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
