import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.requests import Request
from backend.routes import router
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV", "development")
# API_BASE_URL = "/api" if ENV == "production" else "http://127.0.0.1:8000/api"
ALLOWED_ORIGINS = [os.getenv("FRONTEND_URL", "http://localhost:5173")]

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(router, prefix="/api")

if ENV == "production":
    app.mount("/", StaticFiles(directory="backend/static/assets"), name="static")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        return FileResponse("backend/static/index.html")
