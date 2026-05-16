from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Direct imports since we're running from inside backend/
from database import lifespan
from routes.forms import router as forms_router
from routes.submissions import router as submissions_router

app = FastAPI(title="Dynamic Forms API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forms_router)
app.include_router(submissions_router)