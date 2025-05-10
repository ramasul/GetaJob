from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class PersonalInformation(BaseModel):
    name: str = Field(default="")
    email: Optional[str] = Field(default="")
    phone: Optional[str] = Field(default="")
    description: Optional[str] = Field(default="")
    location: Optional[str] = Field(default="")

class ApplierSkills(BaseModel):
    skill: str = Field(default="")

class ApplierAchievements(BaseModel):
    achievement: str = Field(default="")
    date: Optional[str] = Field(default="")

class ApplierEducation(BaseModel):
    institution: str = Field(default="")
    degree: Optional[str] = Field(default="")
    field_of_study: Optional[str] = Field(default="")
    start_date: Optional[str] = Field(default="")
    end_date: Optional[str] = Field(default="") # Bisa "present"
    gpa: Optional[str] = Field(default="")

class ApplierExperience(BaseModel):
    company: str = Field(default="")
    location: Optional[str] = Field(default="")
    position: Optional[str] = Field(default="")
    start_date: Optional[str] = Field(default="")
    end_date: Optional[str] = Field(default="")  # Bisa "present"
    responsibilities: Optional[List[str]] = Field(default_factory=list)

class ParserResponse(BaseModel):
    personal_information: PersonalInformation = Field(default_factory=PersonalInformation)
    skills: List[ApplierSkills] = Field(default_factory=list)
    achievements: List[ApplierAchievements] = Field(default_factory=list)
    educations: List[ApplierEducation] = Field(default_factory=list)
    experiences: List[ApplierExperience] = Field(default_factory=list)

class ResumeUpdate(BaseModel):
    resume_url: Optional[str] = None
    resume_parsed: Optional[ParserResponse] = None
    updated_at: datetime = Field(default_factory=datetime.now)

class ResumeDeleteOptions(BaseModel):
    delete_resume_url: bool = False
    delete_resume_parsed: bool = False
    updated_at: datetime = Field(default_factory=datetime.now)

class RecruiterRateResume(BaseModel):
    score: Optional[str] = None 
    explanation: Optional[str] = None

class ApplierRateResume(BaseModel):
    score: Optional[str] = None 
    strengths: Optional[str] = None
    suggestions: Optional[str] = None

class ApplierAskJob(BaseModel):
    suitability: Optional[str] = None
    explanation: Optional[str] = None
    suggestions: Optional[str] = None
