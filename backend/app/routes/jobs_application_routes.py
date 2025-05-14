from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config.db import Database
from app.controllers.jobs_application_controller import JobApplicationController
from app.models.jobs_application_model import (
    JobApplicationCreate,
    JobApplicationUpdate,
    JobApplicationResponse
)

router = APIRouter(prefix="/applications", tags=["Job Applications"])

async def get_application_controller() -> JobApplicationController:
    db = Database.get_db()
    return JobApplicationController(db)

@router.post("/", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    application: JobApplicationCreate,
    controller: JobApplicationController = Depends(get_application_controller)
):
    """Membuat job application baru"""
    return await controller.create_application(application)

@router.get("/{application_id}", response_model=JobApplicationResponse)
async def get_application(
    application_id: str,
    controller: JobApplicationController = Depends(get_application_controller)
):
    """Mendapatkan data job application berdasarkan ID"""
    return await controller.get_application(application_id)

@router.get("/history/{applier_id}", response_model=List[Dict])
async def get_applier_job_history(
    applier_id: str,
    skip: int = 0,
    limit: int = 10,
    controller: JobApplicationController = Depends(get_application_controller)
):
    """Mendapatkan history job application dengan detail job"""
    return await controller.get_applier_job_history(applier_id, skip, limit)

@router.get("/job/{job_id}/appliers", response_model=List[Dict])
async def get_applications_by_job_id(
    job_id: str,
    skip: int = 0,
    limit: int = 10,
    controller: JobApplicationController = Depends(get_application_controller)
):
    """Mendapatkan semua applier untuk job tertentu dengan detail applier"""
    return await controller.get_applications_by_job_id(job_id, skip, limit)

@router.get("/job/{job_id}/count")
async def get_applier_count_by_job_id(
    job_id: str,
    controller: JobApplicationController = Depends(get_application_controller)
):
    """Mendapatkan total jumlah applier untuk job tertentu"""
    count = await controller.get_applier_count_by_job_id(job_id)
    return {"count": count}

@router.put("/{application_id}", response_model=JobApplicationResponse)
async def update_application(
    application_id: str,
    application_update: JobApplicationUpdate,
    controller: JobApplicationController = Depends(get_application_controller)
):
    """Update data job application berdasarkan ID"""
    return await controller.update_application(application_id, application_update)

@router.delete("/{application_id}")
async def delete_application(
    application_id: str,
    controller: JobApplicationController = Depends(get_application_controller)
):
    """Delete job application berdasarkan ID"""
    return await controller.delete_application(application_id)