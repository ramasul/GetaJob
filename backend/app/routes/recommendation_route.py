from typing import List
from fastapi import APIRouter, Depends, Query, status

from app.config.db import Database
from app.ai_services.recommendation_service import RecommendationService
from app.controllers.job_controller import JobController
from app.models.job_model import JobResponse, JobWithImageResponse

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

async def get_recommendation_service() -> RecommendationService:
    """Dependency untuk mendapatkan instance ApplierController"""
    db = Database.get_db()
    return RecommendationService(db)

async def get_job_controller() -> JobController:
    db = Database.get_db()
    return JobController(db)

@router.post("/cluster/applierdbscan", response_model=bool, status_code=status.HTTP_200_OK)
async def refresh_applier_cluster_dbscan(
    epsilon: float = Query(0.5, ge=0.0, le=1.0),
    min_samples: int = Query(5, ge=1),
    controller: RecommendationService = Depends(get_recommendation_service)
):
    """API untuk merefresh cluster applier"""
    return await controller.cluster_users_DBSCAN(epsilon, min_samples)

@router.post("/cluster/applierkmeans", response_model=bool, status_code=status.HTTP_200_OK)
async def refresh_applier_cluster_kmeans(
    n_clusters: int = Query(5, ge=1),
    controller: RecommendationService = Depends(get_recommendation_service)
):
    """API untuk merefresh cluster applier"""
    return await controller.cluster_users_KMeans(n_clusters)

@router.get("/applier/{applier_id}", response_model=List[JobWithImageResponse])
async def get_applier_recommendations(
    applier_id: str,
    limit: int = Query(10, ge=1, le=100),
    weight: float = Query(0.3, ge=0.0, le=1.0),
    controller: RecommendationService = Depends(get_recommendation_service),
    job_controller: JobController = Depends(get_job_controller)
):
    """API untuk mendapatkan rekomendasi pekerjaan untuk applier tertentu"""
    top_job_ids = await controller.get_recommendations_for_user(applier_id, limit, weight)
    jobs = []
    for job_id in top_job_ids:
        job = await job_controller.get_job_with_image(job_id)
        if job:
            jobs.append(job)
    return jobs
