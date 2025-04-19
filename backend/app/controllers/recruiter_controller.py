import logging
from bson import ObjectId
from datetime import datetime
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.recruiter_model import (
    RecruiterCreate,
    RecruiterUpdate,
    RecruiterInDB,
    RecruiterResponse,
)
from app.utils.auth_helper import get_password_hash, verify_password

logger = logging.getLogger(__name__)


class RecruiterController:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = database.recruiters
        self.applier_collection = database.appliers

    async def create_recruiter(self, recruiter: RecruiterCreate) -> RecruiterResponse:
        """Membuat data recruiter baru ke database"""
        if await self.collection.find_one(
            {"username": recruiter.username}
        ) or await self.applier_collection.find_one({"username": recruiter.username}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
            )

        if await self.collection.find_one(
            {"email": recruiter.email}
        ) or await self.applier_collection.find_one({"email": recruiter.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        hashed_password = get_password_hash(recruiter.password)

        recruiter_in_db = RecruiterInDB(
            **recruiter.model_dump(exclude={"password"}), password_hash=hashed_password
        )

        recruiter_dict = recruiter_in_db.model_dump(by_alias=True)
        if isinstance(recruiter_dict["_id"], str):
            recruiter_dict["_id"] = ObjectId(recruiter_dict["_id"])

        result = await self.collection.insert_one(recruiter_dict)

        created_recruiter = await self.collection.find_one({"_id": result.inserted_id})
        if created_recruiter is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create recruiter",
            )
        created_recruiter["_id"] = str(created_recruiter["_id"])
        return RecruiterResponse(**created_recruiter)

    async def get_recruiter(self, recruiter_id: str) -> RecruiterResponse:
        """Mengambil data recruiter berdasarkan ID"""
        try:
            recruiter = await self.collection.find_one({"_id": ObjectId(recruiter_id)})
        except Exception as e:
            logger.error(f"Error retrieving recruiter: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

        if recruiter is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recruiter with ID {recruiter_id} not found",
            )
        recruiter["_id"] = str(recruiter["_id"])
        return RecruiterResponse(**recruiter)

    async def get_recruiter_by_username(self, username: str) -> RecruiterResponse:
        """Menampilkan data recruiter berdasarkan username"""
        recruiter = await self.collection.find_one({"username": username})

        if recruiter is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recruiter with username {username} not found",
            )
        recruiter["_id"] = str(recruiter["_id"])
        return RecruiterResponse(**recruiter)

    async def get_recruiter_by_email(self, email: str) -> RecruiterResponse:
        """Menampilkan data recruiter berdasarkan email"""
        recruiter = await self.collection.find_one({"email": email})

        if recruiter is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recruiter with email {email} not found",
            )
        recruiter["_id"] = str(recruiter["_id"])
        return RecruiterResponse(**recruiter)

    async def get_all_recruiters(
        self, skip: int = 0, limit: int = 100
    ) -> List[RecruiterResponse]:
        """Menampilkan semua data recruiter"""
        recruiters = []
        cursor = self.collection.find().skip(skip).limit(limit)

        async for document in cursor:
            document["_id"] = str(document["_id"])
            recruiters.append(RecruiterResponse(**document))

        return recruiters

    async def update_recruiter(
        self, recruiter_id: str, update_data: RecruiterUpdate
    ) -> RecruiterResponse:
        """Update recruiter"""
        try:
            recruiter = await self.collection.find_one({"_id": ObjectId(recruiter_id)})
            if recruiter is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Recruiter with ID {recruiter_id} not found",
                )

            update_dict = update_data.model_dump(exclude_unset=True)

            if (
                "username" in update_dict
                and update_dict["username"] != recruiter["username"]
            ):
                if await self.collection.find_one(
                    {"username": update_dict["username"]}
                ) or await self.applier_collection.find_one(
                    {"username": update_dict["username"]}
                ):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Username already taken",
                    )

            if "email" in update_dict and update_dict["email"] != recruiter["email"]:
                if await self.collection.find_one(
                    {"email": update_dict["email"]}
                ) or await self.applier_collection.find_one(
                    {"email": update_dict["email"]}
                ):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email already registered",
                    )

            update_dict["updated_at"] = datetime.now()

            if not update_dict:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No fields to update",
                )

            result = await self.collection.update_one(
                {"_id": ObjectId(recruiter_id)}, {"$set": update_dict}
            )

            if result.modified_count == 0 and result.matched_count == 1:
                pass
            elif result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update recruiter",
                )

            updated_recruiter = await self.collection.find_one(
                {"_id": ObjectId(recruiter_id)}
            )
            updated_recruiter["_id"] = str(updated_recruiter["_id"])
            return RecruiterResponse(**updated_recruiter)

        except Exception as e:
            logger.error(f"Error updating recruiter: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating recruiter: {str(e)}",
            )

    async def change_password(
        self, recruiter_id: str, current_password: str, new_password: str
    ) -> bool:
        """Ubah password recruiter menggunakan password lama dan password baru."""
        try:
            recruiter = await self.collection.find_one({"_id": ObjectId(recruiter_id)})
            if recruiter is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Recruiter with ID {recruiter_id} not found",
                )

            if not verify_password(current_password, recruiter["password_hash"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password is incorrect",
                )

            if verify_password(new_password, recruiter["password_hash"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="New password cannot be the same as the current password",
                )

            hashed_password = get_password_hash(new_password)

            result = await self.collection.update_one(
                {"_id": ObjectId(recruiter_id)},
                {
                    "$set": {
                        "password_hash": hashed_password,
                        "updated_at": datetime.now(),
                    }
                },
            )

            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update password",
                )

            return {"message": "Password changed successfully"}

        except Exception as e:
            raise e

    async def delete_recruiter(self, recruiter_id: str) -> bool:
        """Hapus data recruiter dari database berdasarkan idnya."""
        try:
            recruiter = await self.collection.find_one({"_id": ObjectId(recruiter_id)})
            if recruiter is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Recruiter with ID {recruiter_id} not found",
                )

            result = await self.collection.delete_one({"_id": ObjectId(recruiter_id)})

            if result.deleted_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to delete recruiter",
                )

            return {"message": "Recruiter deleted successfully"}

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting recruiter: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting recruiter: {str(e)}",
            )

    async def search_recruiters(
        self, query: dict, skip: int = 0, limit: int = 100
    ) -> List[RecruiterResponse]:
        """Cari recruiter berdasarkan query yang diberikan."""
        recruiters = []
        cursor = self.collection.find(query).skip(skip).limit(limit)

        async for document in cursor:
            document["_id"] = str(document["_id"])
            recruiters.append(RecruiterResponse(**document))

        return recruiters