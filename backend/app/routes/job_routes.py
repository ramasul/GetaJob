from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.config.db import Database
from app.controllers.job_controller import JobController
from app.models.job_model import (
    JobCreate,
    JobUpdate,
    JobResponse
)

router = APIRouter(prefix="/jobs", tags=["Jobs"])

async def get_job_controller() -> JobController:
    db = Database.get_db()
    return JobController(db)

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job: JobCreate,
    controller: JobController = Depends(get_job_controller)
):
    """Membuat job posting baru"""
    return await controller.create_job(job)

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str,
    controller: JobController = Depends(get_job_controller)
):
    """Mendapatkan data job berdasarkan ID"""
    return await controller.get_job(job_id)

@router.get("/", response_model=List[JobResponse])
async def get_jobs(
    skip: int = 0,
    limit: int = 10,
    controller: JobController = Depends(get_job_controller)
):
    """Mendapatkan semua data job dengan batasan jumlah untuk Pagination"""
    return await controller.get_jobs(skip, limit)

@router.get("/recruiter/{recruiter_id}", response_model=List[JobResponse])
async def get_jobs_by_recruiter(
    recruiter_id: str,
    skip: int = 0,
    limit: int = 10,
    controller: JobController = Depends(get_job_controller)
):
    """Mendapatkan semua job posting dari recruiter tertentu"""
    return await controller.get_jobs_by_recruiter(recruiter_id, skip, limit)

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    job_update: JobUpdate,
    controller: JobController = Depends(get_job_controller)
):
    """Update data job berdasarkan ID"""
    return await controller.update_job(job_id, job_update)

@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    controller: JobController = Depends(get_job_controller)
):
    """Delete job berdasarkan ID"""
    return await controller.delete_job(job_id)

@router.get("/search/", response_model=List[JobResponse])
async def search_jobs(
    query: str = "",
    skip: int = 0,
    limit: int = 100,
    controller: JobController = Depends(get_job_controller)
):
    """Mencari job berdasarkan query"""
    search_query = {"$text": {"$search": query}} if query else {}
    return await controller.search_jobs(search_query, skip, limit)