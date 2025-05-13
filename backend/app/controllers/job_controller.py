import logging
from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional

from app.models.job_model import JobCreate, JobUpdate, JobInDB, JobResponse, JobWithImageResponse

logger = logging.getLogger(__name__)

class JobController:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = database.jobs
        self.recruiter_collection = database.recruiters

    async def create_job(self, job: JobCreate) -> JobResponse:
        """Membuat job baru."""
        try:
            recruiter_id = ObjectId(str(job.recruiter_id))
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid recruiter_id format"
            )

        if not await self.recruiter_collection.find_one({"_id": recruiter_id}):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Recruiter not found"
            )

        try:
            job_dict = job.model_dump()
            job_dict["_id"] = ObjectId()
            job_dict["recruiter_id"] = recruiter_id
            job_dict["created_at"] = datetime.now()
            job_dict["updated_at"] = datetime.now()
            
            await self.collection.insert_one(job_dict)
            
            job_dict["_id"] = str(job_dict["_id"])
            job_dict["recruiter_id"] = str(job_dict["recruiter_id"])
            
            return JobResponse(**job_dict)
            
        except Exception as e:
            logger.error(f"Error creating job: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create job"
            )
        
    async def get_job(self, job_id: str) -> JobResponse:
        """Mendapatkan job berdasarkan job_id."""
        try:
            job_id = ObjectId(job_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid job_id format"
            )

        job = await self.collection.find_one({"_id": job_id})
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Job not found"
            )

        job["_id"] = str(job["_id"])
        job["recruiter_id"] = str(job["recruiter_id"])
        return JobResponse(**job)

    async def get_jobs(self, skip: int = 0, limit: int = 10) -> List[JobResponse]:
        """Mendapatkan semua job."""
        try:
            cursor = self.collection.find().skip(skip).limit(limit)
            jobs = await cursor.to_list(length=limit)
            
            for job in jobs:
                job["_id"] = str(job["_id"])
                job["recruiter_id"] = str(job["recruiter_id"])
                
            return [JobResponse(**job) for job in jobs]
        except Exception as e:
            logger.error(f"Error fetching jobs: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch jobs"
            )
        
    async def get_jobs_by_recruiter(self, recruiter_id: str, skip: int = 0, limit: int = 10) -> List[JobResponse]:
        """Mendapatkan semua job dari recruiter_id."""
        try:
            recruiter_id = ObjectId(recruiter_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid recruiter_id format"
            )

        cursor = self.collection.find({"recruiter_id": recruiter_id}).skip(skip).limit(limit)
        jobs = await cursor.to_list(length=limit)
        
        for job in jobs:
            job["_id"] = str(job["_id"])
            job["recruiter_id"] = str(job["recruiter_id"])
            
        return [JobResponse(**job) for job in jobs]

    async def update_job(self, job_id: str, job_update: JobUpdate) -> JobResponse:
        """Update job berdasarkan job_id."""
        try:
            job_id = ObjectId(job_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid job_id format"
            )

        update_data = job_update.model_dump(exclude_unset=True)
        update_data["updated_at"] = datetime.now()

        result = await self.collection.update_one(
            {"_id": job_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found or no changes made"
            )

        updated_job = await self.collection.find_one({"_id": job_id})
        updated_job["_id"] = str(updated_job["_id"])
        updated_job["recruiter_id"] = str(updated_job["recruiter_id"])
        return JobResponse(**updated_job)

    async def delete_job(self, job_id: str) -> bool:
        """Hapus job berdasarkan job_id."""
        try:
            job_id = ObjectId(job_id)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Invalid job_id format"
            )

        result = await self.collection.delete_one({"_id": job_id})
        
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )

    async def search_jobs(self, query: str, skip: int = 0, limit: int = 100) -> List[JobResponse]:
        """Cari job berdasarkan query dengan substring matching."""
        try:
            jobs = []
            
            if query:
                # Case-insensitive regex search across multiple fields
                search_query = {
                    "$or": [
                        {"job_title": {"$regex": query, "$options": "i"}},
                        {"company_name": {"$regex": query, "$options": "i"}},
                        {"location": {"$regex": query, "$options": "i"}},
                        {"employment_type": {"$regex": query, "$options": "i"}},
                        {"description": {"$regex": query, "$options": "i"}}
                    ]
                }
                
                # This adds documents where any array element contains the query string
                skill_query = {"required_skills": {"$elemMatch": {"$regex": query, "$options": "i"}}}
                search_query["$or"].append(skill_query)
            else:
                search_query = {}
            
            cursor = self.collection.find(search_query).skip(skip).limit(limit)
        
            async for document in cursor:
                document["_id"] = str(document["_id"])
                document["recruiter_id"] = str(document["recruiter_id"])
                jobs.append(JobResponse(**document))
        
            return jobs
        
        except Exception as e:
            logger.error(f"Error searching jobs: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to search jobs"
            )
        
    async def get_jobs_with_image(self, skip: int = 0, limit: int = 10) -> List[JobWithImageResponse]:
        """Mendapatkan semua job dengan gambar."""
        try:
            cursor = self.collection.find().skip(skip).limit(limit)
            jobs = await cursor.to_list(length=limit)
            
            for job in jobs:
                job["_id"] = str(job["_id"])
                recruiter_id = job["recruiter_id"]
                job["recruiter_id"] = str(job["recruiter_id"])
                recruiter = await self.db.recruiters.find_one({"_id": recruiter_id})
                if recruiter and "profile_picture_url" in recruiter:
                    job["profile_picture_url"] = recruiter["profile_picture_url"]
                else:
                    job["profile_picture_url"] = None

            return [JobResponse(**job) for job in jobs]
        except Exception as e:
            logger.error(f"Error fetching jobs: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to fetch jobs"
            )

    async def search_jobs_with_image(
        self, 
        query: str = "", 
        skip: int = 0, 
        limit: int = 100
    ) -> List[JobWithImageResponse]:
        """Cari job dengan gambar berdasarkan query dengan substring matching."""
        try:
            jobs = []
            
            if query:
                # Case-insensitive regex search across multiple fields
                search_query = {
                    "$or": [
                        {"job_title": {"$regex": query, "$options": "i"}},
                        {"company_name": {"$regex": query, "$options": "i"}},
                        {"location": {"$regex": query, "$options": "i"}},
                        {"employment_type": {"$regex": query, "$options": "i"}},
                        {"description": {"$regex": query, "$options": "i"}}
                    ]
                }
                
                # This adds documents where any array element contains the query string
                skill_query = {"required_skills": {"$elemMatch": {"$regex": query, "$options": "i"}}}
                search_query["$or"].append(skill_query)
            else:
                search_query = {}
            
            cursor = self.collection.find(search_query).skip(skip).limit(limit)
        
            async for document in cursor:
                document["_id"] = str(document["_id"])
                recruiter_id = document["recruiter_id"]
                document["recruiter_id"] = str(document["recruiter_id"])
                
                recruiter = await self.db.recruiters.find_one({"_id": recruiter_id})
                if recruiter and "profile_picture_url" in recruiter:
                    document["profile_picture_url"] = recruiter["profile_picture_url"]
                else:
                    document["profile_picture_url"] = None
                
                jobs.append(JobWithImageResponse(**document))
        
            return jobs
        
        except Exception as e:
            logger.error(f"Error searching jobs: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to search jobs"
            )
        
    async def count_search_jobs(self, query: str = "") -> int:
        """Count total number of jobs matching the search query without retrieving documents."""
        try:
            if query:
                search_query = {
                    "$or": [
                        {"job_title": {"$regex": query, "$options": "i"}},
                        {"company_name": {"$regex": query, "$options": "i"}},
                        {"location": {"$regex": query, "$options": "i"}},
                        {"employment_type": {"$regex": query, "$options": "i"}},
                        {"description": {"$regex": query, "$options": "i"}}
                    ]
                }
                
                skill_query = {"required_skills": {"$elemMatch": {"$regex": query, "$options": "i"}}}
                search_query["$or"].append(skill_query)
            else:
                search_query = {}
            
            total = await self.collection.count_documents(search_query)
            return total
        except Exception as e:
            logger.error(f"Error counting search results: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to count search results"
            )