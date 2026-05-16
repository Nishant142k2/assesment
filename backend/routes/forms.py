from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime, timezone

from database import forms_col
from models.form_models import FormCreate, FormUpdate, FormResponse

router = APIRouter(tags=["forms"])

@router.post("/forms", response_model=FormResponse)
async def create_form(form: FormCreate):
    form_id = str(uuid.uuid4())
    doc = {
        "id": form_id,
        "title": form.title,
        "description": form.description,
        "fields": [f.model_dump() for f in form.fields],
        "created_at": datetime.now(timezone.utc)
    }
    await forms_col.insert_one(doc)
    return doc

@router.get("/forms", response_model=List[FormResponse])
async def list_forms():
    return await forms_col.find().to_list(None)

@router.get("/forms/{form_id}", response_model=FormResponse)
async def get_form(form_id: str):
    form = await forms_col.find_one({"id": form_id})
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form

@router.put("/forms/{form_id}", response_model=FormResponse)
async def update_form(form_id: str, form_update: FormUpdate):
    existing = await forms_col.find_one({"id": form_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Form not found")

    update_data = form_update.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    if "fields" in update_data:
        update_data["fields"] = [f.model_dump() for f in update_data["fields"]]

    await forms_col.update_one({"id": form_id}, {"$set": update_data})
    return await forms_col.find_one({"id": form_id})

@router.delete("/forms/{form_id}")
async def delete_form(form_id: str):
    result = await forms_col.delete_one({"id": form_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Form not found")
    return {"message": "Form deleted successfully"}