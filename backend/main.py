from fastapi import FastAPI
from routes import main as main_routes

app = FastAPI()
app.include_router(main_routes.router)
