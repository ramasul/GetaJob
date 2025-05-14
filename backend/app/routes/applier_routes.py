from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Query, HTTPException, status

from app.config.db import Database
from app.controllers.applier_controller import ApplierController
from app.models.applier_model import ApplierCreate, ApplierUpdate, ApplierResponse
from app.models.resume_model import ResumeDeleteOptions, ResumeUpdate
from app.middleware.permissions import *

router = APIRouter(prefix="/appliers", tags=["Appliers"])

class PasswordChange(BaseModel):
    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)

async def get_applier_controller() -> ApplierController:
    """Dependency untuk mendapatkan instance ApplierController"""
    db = Database.get_db()
    return ApplierController(db)

@router.post("/", response_model=ApplierResponse, status_code=status.HTTP_201_CREATED)
async def create_applier(
    applier: ApplierCreate,
    controller: ApplierController = Depends(get_applier_controller)
):
    """API untuk membuat data applier baru"""
    return await controller.create_applier(applier)

@router.get("/{applier_id}", response_model=ApplierResponse)
async def get_applier(
    applier_id: str,
    controller: ApplierController = Depends(get_applier_controller)
):
    """API untuk mendapatkan data applier berdasarkan ID"""
    return await controller.get_applier(applier_id)

@router.get("/", response_model=List[ApplierResponse])
async def get_all_appliers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    controller: ApplierController = Depends(get_applier_controller)
):
    """API untuk mendapatkan semua data applier dengan batasan jumlah untuk Pagination."""
    return await controller.get_all_appliers(skip, limit)

@router.get("/username/{username}", response_model=ApplierResponse)
async def get_applier_by_username(
    username: str,
    controller: ApplierController = Depends(get_applier_controller)
):
    """API untuk mendapatkan data applier berdasarkan username."""
    return await controller.get_applier_by_username(username)

@router.get("/email/{email}", response_model=ApplierResponse)
async def get_applier_by_email(
    email: str,
    controller: ApplierController = Depends(get_applier_controller)
):
    """API untuk mendapatkan data applier berdasarkan email."""
    return await controller.get_applier_by_email(email)

@router.put("/{applier_id}", response_model=ApplierResponse)
async def update_applier(
    applier_id: str,
    applier: ApplierUpdate,
    controller: ApplierController = Depends(get_applier_controller),
    user = Depends(owner_of("applier_id", "applier"))
):
    """Update data applier berdasarkan ID"""
    return await controller.update_applier(applier_id, applier)

@router.put("/{applier_id}/clear-profile-picture", status_code=status.HTTP_200_OK)
async def clear_applier_profile_picture(
    applier_id: str,
    controller: ApplierController = Depends(get_applier_controller),
    user = Depends(owner_of("applier_id", "applier"))
):
    """API untuk menghapus foto profil applier berdasarkan ID"""
    return await controller.clear_applier_picture(applier_id)

@router.put("/{applier_id}/update-resume", status_code=status.HTTP_200_OK)
async def update_applier_resume(
    applier_id: str,
    resume: ResumeUpdate,
    controller: ApplierController = Depends(get_applier_controller),
    user = Depends(owner_of("applier_id", "applier"))
):
    """API untuk memperbarui resume applier berdasarkan ID"""
    return await controller.update_resume(applier_id, resume)

@router.put("/{applier_id}/delete-resume-components", status_code=status.HTTP_200_OK)
async def delete_applier_resume_components(
    applier_id: str,
    delete_options: ResumeDeleteOptions,
    controller: ApplierController = Depends(get_applier_controller),
    user = Depends(owner_of("applier_id", "applier"))
):
    """API untuk menghapus komponen resume (URL atau data parsed) dari profil applier"""
    return await controller.delete_resume_components(applier_id, delete_options)

@router.post("/{applier_id}/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    applier_id: str,
    password_data: PasswordChange,
    controller: ApplierController = Depends(get_applier_controller)
):
    """API untuk mengganti password applier."""
    result = await controller.change_password(
        applier_id, 
        password_data.current_password, 
        password_data.new_password
    )
    if not result:
        raise HTTPException(status_code=400, detail="Invalid current password")
    return {"message": "Password updated successfully"}

@router.delete("/{applier_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_applier(
    applier_id: str,
    controller: ApplierController = Depends(get_applier_controller)
):
    """API untuk menghapus data applier berdasarkan ID"""
    result = await controller.delete_applier(applier_id)
    return None

@router.get("/search/", response_model=List[ApplierResponse])
async def search_appliers(
    name: Optional[str] = None,
    education_institution: Optional[str] = None,
    education_field: Optional[str] = None,
    city: Optional[str] = None,
    country: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    controller: ApplierController = Depends(get_applier_controller)
):
    """API untuk mencari data applier berdasarkan kriteria tertentu."""
    query = {}
    
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    
    if education_institution:
        query["last_education.institution"] = {"$regex": education_institution, "$options": "i"}
    
    if education_field:
        query["last_education.field_of_study"] = {"$regex": education_field, "$options": "i"}
    
    if city:
        query["address.city"] = {"$regex": city, "$options": "i"}
    
    if country:
        query["address.country"] = {"$regex": country, "$options": "i"}
    
    return await controller.search_appliers(query, skip, limit)