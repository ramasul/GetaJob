from app.utils.object_id import PyObjectId
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class JobBase(BaseModel):
    job_title: str
    company_name: str
    location: str
    employment_type: str
    salary_range: Optional[str] = None
    age_range: Optional[str] = None
    minimum_education: str
    required_skills: List[str] = []
    gender: Optional[str] = None
    job_experience: Optional[str] = None
    description: Optional[str] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class JobCreate(JobBase):
    recruiter_id: str  # FK ke Recruiter 

class JobUpdate(BaseModel):
    job_title: Optional[str] = None
    company_name: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    salary_range: Optional[str] = None
    age_range: Optional[str] = None
    minimum_education: Optional[str] = None
    required_skills: Optional[List[str]] = None
    gender: Optional[str] = None
    job_experience: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class JobInDB(JobBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    recruiter_id: PyObjectId 

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

class JobResponse(JobBase):
    id: PyObjectId = Field(alias="_id")
    recruiter_id: PyObjectId

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

class JobWithImageResponse(JobBase):
    id: PyObjectId = Field(alias="_id")
    recruiter_id: PyObjectId
    profile_picture_url: Optional[str] = None

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}