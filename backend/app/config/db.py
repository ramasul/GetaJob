import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure

logger = logging.getLogger(__name__)
class Database:
    client: Optional[AsyncIOMotorClient] = None

    @classmethod
    async def connect_db(cls, db_url: str):
        """Fungsi untuk menghubungkan ke database MongoDB"""
        try:
            cls.client = AsyncIOMotorClient(db_url)
            await cls.client.admin.command("ping")
            logger.info("Connected to MongoDB database")
        except ConnectionFailure:
            logger.error("Failed to connect to MongoDB database")
            raise

    @classmethod
    async def close_db(cls):
        """Fungsi untuk menutup koneksi ke database MongoDB"""
        if cls.client:
            cls.client.close()
            logger.info("Closed connection to MongoDB database")
    
    @classmethod
    def get_db(cls, db_name: str = "getajob_db"):
        """Fungsi untuk mendapatkan database dari MongoDB"""
        if cls.client is None:
            raise Exception("Must call `connect_db` before accessing the database")
        return cls.client[db_name]