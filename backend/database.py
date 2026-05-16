import os
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from fastapi import FastAPI

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "dynamic_forms_db")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
forms_col = db.forms
subs_col = db.submissions

@asynccontextmanager
async def lifespan(app: FastAPI):
    await client.admin.command("ping")
    yield
    client.close()