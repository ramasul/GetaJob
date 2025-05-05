import logging
from bson import ObjectId
from datetime import datetime
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.jobs_application_model import (
    JobApplicationCreate,
    JobApplicationUpdate,
    JobApplicationInDB,
    JobApplicationResponse,
)

logger = logging.getLogger(__name__)

class JobApplicationController:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = database.job_applications
        self.jobs_collection = database.jobs
        self.appliers_collection = database.appliers

    async def create_application(self, application: JobApplicationCreate) -> JobApplicationResponse:
        """Membuat data job application baru"""
        # Verifikasi appelier
        applier = await self.appliers_collection.find_one({"_id": ObjectId(application.applier_id)})
        if not applier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Applier with ID {application.applier_id} not found"
            )

        # Verifikasi job
        job = await self.jobs_collection.find_one({"_id": ObjectId(application.job_id)})
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Job with ID {application.job_id} not found"
            )

        # Cek jika applier sudah pernah apply untuk job ini
        existing_application = await self.collection.find_one({
            "applier_id": ObjectId(application.applier_id),
            "job_id": ObjectId(application.job_id)
        })
        if existing_application:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied for this job"
            )

        application_in_db = JobApplicationInDB(**application.model_dump())
        application_dict = application_in_db.model_dump(by_alias=True)
        
        if isinstance(application_dict["_id"], str):
            application_dict["_id"] = ObjectId(application_dict["_id"])
        application_dict["applier_id"] = ObjectId(application_dict["applier_id"])
        application_dict["job_id"] = ObjectId(application_dict["job_id"])

        result = await self.collection.insert_one(application_dict)
        
        created_application = await self.collection.find_one({"_id": result.inserted_id})
        if created_application is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create job application"
            )
        
        created_application["_id"] = str(created_application["_id"])
        created_application["applier_id"] = str(created_application["applier_id"])
        created_application["job_id"] = str(created_application["job_id"])
        
        return JobApplicationResponse(**created_application)

    async def get_application(self, application_id: str) -> JobApplicationResponse:
        """Mengambil data job application berdasarkan ID"""
        try:
            application = await self.collection.find_one({"_id": ObjectId(application_id)})
            if application is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Application with ID {application_id} not found"
                )
            
            application["_id"] = str(application["_id"])
            application["applier_id"] = str(application["applier_id"])
            application["job_id"] = str(application["job_id"])
            
            return JobApplicationResponse(**application)
        except Exception as e:
            logger.error(f"Error retrieving application: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error"
            )

    async def get_applications_by_applier(self, applier_id: str) -> List[JobApplicationResponse]:
        """Mengambil semua data applications dari applier"""
        applications = []
        cursor = self.collection.find({"applier_id": ObjectId(applier_id)})
        
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["applier_id"] = str(doc["applier_id"])
            doc["job_id"] = str(doc["job_id"])
            applications.append(JobApplicationResponse(**doc))
            
        return applications

    async def get_applications_by_job(self, job_id: str) -> List[JobApplicationResponse]:
        """Mengambil smeua applications untuk job tertentu"""
        applications = []
        cursor = self.collection.find({"job_id": ObjectId(job_id)})
        
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            doc["applier_id"] = str(doc["applier_id"])
            doc["job_id"] = str(doc["job_id"])
            applications.append(JobApplicationResponse(**doc))
            
        return applications

    async def update_application(self, application_id: str, update_data: JobApplicationUpdate) -> JobApplicationResponse:
        """Update job application"""
        try:
            application = await self.collection.find_one({"_id": ObjectId(application_id)})
            if application is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Application with ID {application_id} not found"
                )

            update_dict = update_data.model_dump(exclude_unset=True)
            
            if not update_dict:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No fields to update"
                )

            result = await self.collection.update_one(
                {"_id": ObjectId(application_id)},
                {"$set": update_dict}
            )

            if result.modified_count == 0 and result.matched_count == 1:
                pass
            elif result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update application"
                )

            updated_application = await self.collection.find_one({"_id": ObjectId(application_id)})
            updated_application["_id"] = str(updated_application["_id"])
            updated_application["applier_id"] = str(updated_application["applier_id"])
            updated_application["job_id"] = str(updated_application["job_id"])
            
            return JobApplicationResponse(**updated_application)

        except Exception as e:
            logger.error(f"Error updating application: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating application: {str(e)}"
            )

    async def delete_application(self, application_id: str) -> bool:
        """Delete job application"""
        try:
            application = await self.collection.find_one({"_id": ObjectId(application_id)})
            if application is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Application with ID {application_id} not found"
                )

            result = await self.collection.delete_one({"_id": ObjectId(application_id)})

            if result.deleted_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to delete application"
                )

            return {"message": "Application deleted successfully"}

        except Exception as e:
            logger.error(f"Error deleting application: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting application: {str(e)}"
            )