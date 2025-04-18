from app.utils.object_id import PyObjectId
from app.utils.timezone_helper import *

from bson import ObjectId
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class LogViewBase(BaseModel):
    applier_id: PyObjectId
    job_id: PyObjectId
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC_PLUS_7))
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

class LogViewCreate(LogViewBase):
    pass

class LogViewInDB(LogViewBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }

# Class for API response
class LogViewResponse(LogViewBase):
    id: PyObjectId = Field(alias="_id")
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True
    }