from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class FormField(BaseModel):
    name: str
    label: str
    type: str
    required: bool = False
    options: Optional[List[str]] = None

class FormCreate(BaseModel):
    title: str
    description: Optional[str] = None
    fields: List[FormField]

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    fields: Optional[List[FormField]] = None

class FormResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    fields: List[FormField]
    created_at: datetime

class SubmissionCreate(BaseModel):
    data: Dict[str, Any]

class SubmissionResponse(BaseModel):
    id: str
    form_id: str
    data: Dict[str, Any]
    submitted_at: datetime