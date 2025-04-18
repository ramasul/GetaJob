from app.utils.object_id import PyObjectId
from bson import ObjectId
from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, field_validator, validator
from email_validator import validate_email, EmailNotValidError

# Kalau misal ada field yang tidak wajib diisi, bisa ditambahkan Optional
# Kalau misal ada elemen yang punya banyak field, bisa dibuat class baru
# Misalnya, Address punya banyak field, jadi kita buat class Address 
class Education(BaseModel):
    education_level: str
    institution: Optional[str]
    degree: Optional[str]
    field_of_study: Optional[str]
    graduation_year: Optional[int]

class Address(BaseModel):
    street: Optional[str]
    city: Optional[str]
    state: str
    country: Optional[str] = "Indonesia"
    postal_code: Optional[str]

# ApplierBase adalah class yang default yang akan digunakan untuk membuat data
# Password tidak dimasukkan
# Dob wajib datetime di mongoDB, jadi kita harus convert dob dari date ke datetime
class ApplierBase(BaseModel):
    username: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[Address] = None
    dob: datetime
    last_education: Education
    bio: Optional[str] = None
    resume_url: Optional[str] = None
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

# ApplierCreate adalah class yang digunakan untuk membuat data applier baru
# Password taro disini
class ApplierCreate(ApplierBase):
    dob: date
    password: str = Field(..., min_length=8)

# ApplierUpdate adalah class yang digunakan untuk mengupdate data applier
# Password tidak dimasukkan
class ApplierUpdate(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[Address] = None
    dob: Optional[date] = None
    last_education: Optional[Education] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None
    resume_url: Optional[str] = None
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

class ApplierInDB(ApplierBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id") 
    password_hash: str
    cluster_id: Optional[int] = None
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class ApplierResponse(ApplierBase):
    id: PyObjectId = Field(alias="_id")
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }