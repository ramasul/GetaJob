from app.utils.object_id import PyObjectId
from bson import ObjectId
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class JobApplicationBase(BaseModel):
    applier_id: PyObjectId
    job_id: PyObjectId
    document_url: Optional[str] = None
    motivational_letter: str
    created_at: datetime = Field(default_factory=datetime.now)

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplicationUpdate(BaseModel):
    document_url: Optional[str] = None
    motivational_letter: Optional[str] = None

class JobApplicationInDB(JobApplicationBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

class JobApplicationResponse(JobApplicationBase):
    id: PyObjectId = Field(alias="_id")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

class JobApplicationWithDetails(JobApplicationResponse):
    job_details: dict = {}
    applier_details: dict = {}