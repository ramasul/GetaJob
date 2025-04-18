from fastapi import APIRouter, Depends, Query, status

from app.config.db import Database
from app.recommendation.recommendation_service import RecommendationService

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

async def get_recommendation_service() -> RecommendationService:
    """Dependency untuk mendapatkan instance ApplierController"""
    db = Database.get_db()
    return RecommendationService(db)

@router.post("/cluster/applierdbscan", response_model=bool, status_code=status.HTTP_200_OK)
async def refresh_applier_cluster(
    epsilon: float = Query(0.5, ge=0.0, le=1.0),
    min_samples: int = Query(5, ge=1),
    controller: RecommendationService = Depends(get_recommendation_service)
):
    """API untuk merefresh cluster applier"""
    return await controller.cluster_users_DBSCAN(epsilon, min_samples)

@router.post("/cluster/applierkmeans", response_model=bool, status_code=status.HTTP_200_OK)
async def refresh_applier_cluster(
    n_clusters: int = Query(5, ge=1),
    controller: RecommendationService = Depends(get_recommendation_service)
):
    """API untuk merefresh cluster applier"""
    return await controller.cluster_users_KMeans(n_clusters)
