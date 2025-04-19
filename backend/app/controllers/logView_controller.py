import logging

from bson import ObjectId
from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.logView_model import LogViewCreate, LogViewInDB, LogViewResponse
from app.utils.timezone_helper import *

logger = logging.getLogger(__name__)

class LogViewController:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = database.log_views
    
    async def create_log_view(self, log_view: LogViewCreate) -> LogViewResponse:
        """Membuat log view baru ketika user melihat suatu job"""

        log_view_dict = log_view.model_dump()
        log_view_dict["timestamp"] = convert_to_jakarta_time(log_view_dict["timestamp"])
        log_view_create = LogViewCreate(**log_view_dict)
        
        log_view_in_db = LogViewInDB(
            **log_view_create.model_dump()
        )
        
        log_view_dict = log_view_in_db.model_dump(by_alias=True)
        if isinstance(log_view_dict["_id"], str):
            log_view_dict["_id"] = ObjectId(log_view_dict["_id"])
        if isinstance(log_view_dict["applier_id"], str):
            log_view_dict["applier_id"] = ObjectId(log_view_dict["applier_id"])
        if isinstance(log_view_dict["job_id"], str):
            log_view_dict["job_id"] = ObjectId(log_view_dict["job_id"])
        
        result = await self.collection.insert_one(log_view_dict)
        
        created_log_view = await self.collection.find_one({"_id": result.inserted_id})
        if created_log_view is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create log view"
            )
        
        if isinstance(created_log_view["timestamp"], datetime):
            created_log_view["timestamp"] = convert_to_jakarta_time(created_log_view["timestamp"])
        
        created_log_view["_id"] = str(created_log_view["_id"])
        created_log_view["applier_id"] = str(created_log_view["applier_id"])
        created_log_view["job_id"] = str(created_log_view["job_id"])
        return LogViewResponse(**created_log_view)
    
    async def get_logs_by_applier(self, applier_id: str, limit: int = 100) -> List[LogViewResponse]:
        """Mendapatkan semua log view berdasarkan applier_id"""
        applier_obj_id = ObjectId(applier_id)
        cursor = self.collection.find({"applier_id": applier_obj_id})
        logs = await cursor.to_list(limit)
        
        for log in logs:
            log["_id"] = str(log["_id"])
            log["applier_id"] = str(log["applier_id"])
            log["job_id"] = str(log["job_id"])
            if isinstance(log["timestamp"], datetime):
                log["timestamp"] = convert_to_jakarta_time(log["timestamp"])
            
        return [LogViewResponse(**log) for log in logs]
    
    async def get_logs_by_job(self, job_id: str, limit: int = 100) -> List[LogViewResponse]:
        """Mendapatkan semua log view berdasarkan job_id"""
        job_obj_id = ObjectId(job_id)
        cursor = self.collection.find({"job_id": job_obj_id})
        logs = await cursor.to_list(limit)
        
        for log in logs:
            log["_id"] = str(log["_id"])
            log["applier_id"] = str(log["applier_id"])
            log["job_id"] = str(log["job_id"])
            if isinstance(log["timestamp"], datetime):
                log["timestamp"] = convert_to_jakarta_time(log["timestamp"])
            
        return [LogViewResponse(**log) for log in logs]
    