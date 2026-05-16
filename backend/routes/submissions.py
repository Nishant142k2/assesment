from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime, timezone

from database import forms_col, subs_col
from models.form_models import SubmissionCreate, SubmissionResponse

router = APIRouter(tags=["submissions"])

@router.post("/forms/{form_id}/submissions", response_model=SubmissionResponse)
async def submit_response(form_id: str, submission: SubmissionCreate):
    form = await forms_col.find_one({"id": form_id})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    for field in form["fields"]:
        if field["required"] and field["name"] not in submission.data:
            raise HTTPException(status_code=400, detail=f"Missing required field: {field['name']}")

    sub_id = str(uuid.uuid4())
    doc = {
        "id": sub_id,
        "form_id": form_id,
        "data": submission.data,
        "submitted_at": datetime.now(timezone.utc)
    }
    await subs_col.insert_one(doc)
    return doc

@router.get("/forms/{form_id}/submissions", response_model=List[SubmissionResponse])
async def get_submissions(form_id: str):
    if not await forms_col.find_one({"id": form_id}):
        raise HTTPException(status_code=404, detail="Form not found")
    return await subs_col.find({"form_id": form_id}).sort("submitted_at", -1).to_list(None)