import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

ENV = os.getenv("ENV", "development")

if ENV == "production":
    # Use the persistent disk path in production
    db_path = "/data/app.db"
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{db_path}")
else:
    # Use the local SQLite file in development
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///backend/app.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
