from app.utils.object_id import PyObjectId
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, validator
from email_validator import validate_email, EmailNotValidError

class Address(BaseModel):
    street: Optional[str]
    city: Optional[str]
    state: str
    country: Optional[str] = "Indonesia"
    postal_code: Optional[str]

class RecruiterBase(BaseModel):
    username: str
    company_name: str
    company_type: str
    company_description: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[Address] = None
    website_url: Optional[str] = None
    profile_picture_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    @validator("username")
    def username_cannot_be_email(cls, v):
        if v is not None:
            try:
                validate_email(v)
                raise ValueError("Username cannot be in email format")
            except EmailNotValidError:
                pass
        return v

class RecruiterCreate(RecruiterBase):
    password: str = Field(..., min_length=8)

class RecruiterUpdate(BaseModel):
    username: Optional[str] = None
    company_name: Optional[str] = None
    company_type: Optional[str] = None
    company_description: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[Address] = None
    website_url: Optional[str] = None
    profile_picture_url: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.now)
    @validator("username")
    def username_cannot_be_email(cls, v):
        if v is not None:
            try:
                validate_email(v)
                raise ValueError("Username cannot be in email format")
            except EmailNotValidError:
                pass
        return v

class RecruiterInDB(RecruiterBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    password_hash: str

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

class RecruiterResponse(RecruiterBase):
    id: PyObjectId = Field(alias="_id")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)