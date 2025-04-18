from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status

from app.config.db import Database
from app.controllers.logView_controller import LogViewController
from app.models.logView_model import LogViewCreate, LogViewResponse

router = APIRouter(prefix="/log-views", tags=["LogViews"])

async def get_log_view_controller() -> LogViewController:
    """Dependency untuk mendapatkan instance LogViewController"""
    db = Database.get_db()
    return LogViewController(db)

@router.post("/", response_model=LogViewResponse, status_code=status.HTTP_201_CREATED)
async def create_log_view(
    log_view: LogViewCreate,
    controller: LogViewController = Depends(get_log_view_controller)
):
    """API untuk membuat log view baru ketika user melihat suatu job"""
    return await controller.create_log_view(log_view)

@router.get("/applier/{applier_id}", response_model=List[LogViewResponse])
async def get_logs_by_applier(
    applier_id: str,
    limit: int = Query(100, ge=0),
    controller: LogViewController = Depends(get_log_view_controller)
):
    """API untuk mendapatkan semua log view berdasarkan applier_id"""
    return await controller.get_logs_by_applier(applier_id, limit)

@router.get("/job/{job_id}", response_model=List[LogViewResponse])
async def get_logs_by_job(
    job_id: str,
    limit: int = Query(100, ge=0),
    controller: LogViewController = Depends(get_log_view_controller)
):
    """API untuk mendapatkan semua log view berdasarkan job_id"""
    return await controller.get_logs_by_job(job_id, limit)