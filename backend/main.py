import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Set allowed origins dynamically
ENV = os.getenv("ENV", "development")
if ENV == "development":
    ALLOWED_ORIGINS = ["http://localhost:5173"]
else:
    ALLOWED_ORIGINS = [os.getenv("FRONTEND_URL", "http://localhost:5173")]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(router)
