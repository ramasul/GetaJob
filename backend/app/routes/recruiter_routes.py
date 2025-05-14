from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config.db import Database
from app.controllers.recruiter_controller import RecruiterController
from app.models.recruiter_model import (
    RecruiterCreate, 
    RecruiterUpdate, 
    RecruiterResponse,
    ChangePasswordRequest
)
from app.middleware.permissions import *

router = APIRouter(prefix="/recruiters", tags=["Recruiters"])

async def get_recruiter_controller() -> RecruiterController:
    db = Database.get_db()
    return RecruiterController(db)

@router.post("/", response_model=RecruiterResponse, status_code=status.HTTP_201_CREATED)
async def create_recruiter(
    recruiter: RecruiterCreate,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Membuat akun recruiter baru"""
    return await controller.create_recruiter(recruiter)

@router.get("/{recruiter_id}", response_model=RecruiterResponse)
async def get_recruiter(
    recruiter_id: str,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Mendapatkan data recruiter berdasarkan ID"""
    return await controller.get_recruiter(recruiter_id)

@router.get("/username/{username}", response_model=RecruiterResponse)
async def get_recruiter_by_username(
    username: str,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Mendapatkan data recruiter berdasarkan username"""
    return await controller.get_recruiter_by_username(username)

@router.get("/email/{email}", response_model=RecruiterResponse)
async def get_recruiter_by_email(
    email: str,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Mendapatkan data recruiter berdasarkan email"""
    return await controller.get_recruiter_by_email(email)

@router.get("/", response_model=List[RecruiterResponse])
async def get_recruiters(
    skip: int = 0,
    limit: int = 100,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Mendapatkan semua data recruiter dengan batasan jumlah untuk Pagination"""
    return await controller.get_all_recruiters(skip, limit)

@router.put("/{recruiter_id}", response_model=RecruiterResponse)
async def update_recruiter(
    recruiter_id: str,
    recruiter_update: RecruiterUpdate,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Update data recruiter berdasarkan ID"""
    return await controller.update_recruiter(recruiter_id, recruiter_update)

@router.put("/{recruiter_id}/clear-profile-picture", status_code=status.HTTP_200_OK)
async def clear_recruiter_profile_picture(
    recruiter_id: str,
    controller: RecruiterController = Depends(get_recruiter_controller),
    user = Depends(owner_of("recruiter_id", "recruiter"))
):
    """API untuk menghapus foto profil recruiter berdasarkan ID"""
    return await controller.clear_recruiter_picture(recruiter_id)

@router.post("/{recruiter_id}/change-password")
async def change_password(
    recruiter_id: str,
    passwords: ChangePasswordRequest,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Ganti password recruiter"""
    return await controller.change_password(
        recruiter_id,
        passwords.current_password,
        passwords.new_password
    )

@router.delete("/{recruiter_id}")
async def delete_recruiter(
    recruiter_id: str,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Delete recruiter berdasarkan ID"""
    return await controller.delete_recruiter(recruiter_id)

@router.get("/search/", response_model=List[RecruiterResponse])
async def search_recruiters(
    query: str = "",
    skip: int = 0,
    limit: int = 100,
    controller: RecruiterController = Depends(get_recruiter_controller)
):
    """Mencari recruiter berdasarkan query"""
    search_query = {"$text": {"$search": query}} if query else {}
    return await controller.search_recruiters(search_query, skip, limit)