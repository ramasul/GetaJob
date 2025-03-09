import logging
from bson import ObjectId
from datetime import date, datetime
from typing import List, Optional
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status

from app.models.applier_model import ApplierCreate, ApplierUpdate, ApplierInDB, ApplierResponse
from app.utils.common_fn import convert_date_to_datetime
from app.utils.auth_helper import get_password_hash, verify_password

logger = logging.getLogger(__name__)

class ApplierController:
    # Database MongoDB yang digunakan
    # WAJIB ADA
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.collection = database.appliers
        self.recruiter_collection = database.recruiters
    
    async def create_applier(self, applier: ApplierCreate) -> ApplierResponse:
        """Membuat data applier baru ke database"""
        if await self.collection.find_one({"username": applier.username}) or await self.recruiter_collection.find_one({"username": applier.username}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Username already taken"
            )
        
        if await self.collection.find_one({"email": applier.email}) or await self.recruiter_collection.find_one({"email": applier.email}):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Email already registered"
            )
        
        # Hash password untuk keamanan
        hashed_password = get_password_hash(applier.password)
        dob_datetime = convert_date_to_datetime(applier.dob)

        # Buat objek Applier yang akan disimpan ke database
        applier_in_db = ApplierInDB(
            **applier.model_dump(exclude={"password", "dob"}),
            dob=dob_datetime,
            password_hash=hashed_password
        )

        # Secara default, Pydantic akan meng-encode _id sebagai string
        # Maka kita ubah _id menjadi ObjectId agar bisa disimpan ke MongoDB
        applier_dict = applier_in_db.model_dump(by_alias=True)
        if isinstance(applier_dict["_id"], str):
            applier_dict["_id"] = ObjectId(applier_dict["_id"]) 

        # Simpan data applier ke database
        result = await self.collection.insert_one(applier_dict)

        # Ambil data applier yang telah disimpan
        created_applier = await self.collection.find_one({"_id": result.inserted_id})
        if created_applier is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create applier"
            )
        created_applier["_id"] = str(created_applier["_id"])
        return ApplierResponse(**created_applier)
    
    async def get_applier(self, applier_id: str) -> ApplierResponse:
        """Mengambil data applier berdasarkan ID"""
        try:
            # Cari applier berdasarkan ID
            applier = await self.collection.find_one({"_id": ObjectId(applier_id)})
        except Exception as e:
            # Error Handling jangan lupa
            logger.error(f"Error retrieving applier: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error"
            )
        
        if applier is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Applier with ID {applier_id} not found"
            )
        applier["_id"] = str(applier["_id"])
        return ApplierResponse(**applier)
    
    async def get_applier_by_username(self, username: str) -> ApplierResponse:
        """Menampilkan data applier berdasarkan username"""
        applier = await self.collection.find_one({"username": username})
        
        if applier is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Applier with username {username} not found"
            )
        applier["_id"] = str(applier["_id"])
        return ApplierResponse(**applier)
    
    async def get_applier_by_email(self, email: str) -> ApplierResponse:
        """Menampilkan data applier berdasarkan email"""
        applier = await self.collection.find_one({"email": email})

        if applier is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Applier with email {email} not found"
            )
        applier["_id"] = str(applier["_id"])
        return ApplierResponse(**applier)
    
    async def get_all_appliers(self, skip: int = 0, limit: int = 100) -> List[ApplierResponse]:
        """Menampilkan semua data applier"""
        appliers = []
        cursor = self.collection.find().skip(skip).limit(limit)
        
        async for document in cursor:
            document["_id"] = str(document["_id"])
            appliers.append(ApplierResponse(**document))
        
        return appliers
    
    async def update_applier(self, applier_id: str, update_data: ApplierUpdate) -> ApplierResponse:
        """Update an applier's information."""
        try:
            # Cek apakah applier dengan ID tersebut ada
            applier = await self.collection.find_one({"_id": ObjectId(applier_id)})
            if applier is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Applier with ID {applier_id} not found"
                )
            
            # Ubah data update menjadi dictionary
            update_dict = update_data.model_dump(exclude_unset=True)
            if "dob" in update_dict:
                update_dict["dob"] = convert_date_to_datetime(update_dict["dob"])
            
            # Cek apakah username diubah dan sudah ada yang menggunakan username tersebut
            if "username" in update_dict and update_dict["username"] != applier["username"]:
                if await self.collection.find_one({"username": update_dict["username"]}) or await self.recruiter_collection.find_one({"username": update_dict["username"]}):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Username already taken"
                    )
            
            # Cek apakah email diubah dan sudah ada yang menggunakan email tersebut
            if "email" in update_dict and update_dict["email"] != applier["email"]:
                if await self.collection.find_one({"email": update_dict["email"]}) or await self.recruiter_collection.find_one({"email": update_dict["email"]}):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email already registered"
                    )
            
            # SELALU update updated_at
            update_dict["updated_at"] = datetime.now()
            
            # Handle apabila tidak ada field yang diupdate
            if not update_dict:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No fields to update"
                )
            
            # Update data applier
            result = await self.collection.update_one(
                {"_id": ObjectId(applier_id)},
                {"$set": update_dict}
            )
            
            if result.modified_count == 0 and result.matched_count == 1:
                # Jika tidak ada field yang diupdate
                pass
            elif result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update applier"
                )
            
            # Return updated applier
            updated_applier = await self.collection.find_one({"_id": ObjectId(applier_id)})
            updated_applier["_id"] = str(updated_applier["_id"])
            return ApplierResponse(**updated_applier)
            
        except Exception as e:
            logger.error(f"Error updating applier: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating applier: {str(e)}"
            )
        
    async def change_password(self, applier_id: str, current_password: str, new_password: str) -> bool:
        """Ubah password applier menggunakan password lama dan password baru."""
        try:
            # Cek apakah applier dengan ID tersebut ada
            applier = await self.collection.find_one({"_id": ObjectId(applier_id)})
            if applier is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Applier with ID {applier_id} not found"
                )
            
            # Cek apakah password lama benar
            if not verify_password(current_password, applier["password_hash"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Current password is incorrect"
                )
            
            if verify_password(new_password, applier["password_hash"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="New password cannot be the same as the current password"
                )
            
            # Hash password baru
            hashed_password = get_password_hash(new_password)
            
            # Update password
            result = await self.collection.update_one(
                {"_id": ObjectId(applier_id)},
                {
                    "$set": {
                        "password_hash": hashed_password,
                        "updated_at": datetime.now()
                    }
                }
            )
            
            if result.modified_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update password"
                )
            
            return True
            
        except Exception as e:
            raise e

    async def delete_applier(self, applier_id: str) -> bool:
        """Hapus data applier dari database berdasarkan idnya."""
        try:
            # Check if applier exists
            applier = await self.collection.find_one({"_id": ObjectId(applier_id)})
            if applier is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Applier with ID {applier_id} not found"
                )
            
            # Hapus applier
            result = await self.collection.delete_one({"_id": ObjectId(applier_id)})
            
            if result.deleted_count == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to delete applier"
                )
            
            return True
            
        except Exception as e:
            logger.error(f"Error deleting applier: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting applier: {str(e)}"
            )

    async def search_appliers(self, query: dict, skip: int = 0, limit: int = 100) -> List[ApplierResponse]:
        """Cari applier berdasarkan query yang diberikan."""
        appliers = []
        cursor = self.collection.find(query).skip(skip).limit(limit)
        
        async for document in cursor:
            document["_id"] = str(document["_id"])
            appliers.append(ApplierResponse(**document))
        
        return appliers