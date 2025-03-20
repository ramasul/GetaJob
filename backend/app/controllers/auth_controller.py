import os
import random
import logging
import smtplib
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Union, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext
from secrets import token_hex
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.models.auth_model import Token, TokenData, UserResponse
from app.utils.common_fn import convert_date_to_datetime
from app.utils.auth_helper import oauth2_scheme, get_password_hash, verify_password, create_access_token, create_refresh_token
from app.utils.constants import OTP_EXPIRED_MINUTES, ACCESS_TOKEN_EXPIRE_MINUTES, JWT_ALGORITHM
from app.controllers.applier_controller import ApplierController
from app.controllers.recruiter_controller import RecruiterController

logger = logging.getLogger(__name__)

class AuthController:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.applier_controller = ApplierController(database)
        self.recruiter_controller = RecruiterController(database)

    async def send_password_reset_email(self, email: str) -> bool:
        """
        Menggenerate OTP dan mengirim email reset password.
        Mengembalikan True jika email berhasil dikirim.
        """
        try:
            # Cek apakah email ada di database
            user = None
            user_type = None
            
            applier = await self.db.appliers.find_one({"email": email})
            if applier:
                user = applier
                user_type = "applier"
            else:
                recruiter = await self.db.recruiters.find_one({"email": email})
                if recruiter:
                    user = recruiter
                    user_type = "recruiter"
            
            if not user:
                return True
   
            # Generate 6-digit OTP
            otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            
            # Simpan OTP di database dengan masa kadaluarsa (15 minutes)
            expiry = datetime.now() + timedelta(minutes=OTP_EXPIRED_MINUTES)
            
            await self.db.password_resets.update_one(
                {"email": email},
                {
                    "$set": {
                        "email": email,
                        "otp": otp,
                        "expires_at": expiry,
                        "user_type": user_type,
                        "created_at": datetime.now()
                    }
                },
                upsert=True
            )
            
            # Kirim email dengan OTP
            sender_email = os.getenv("EMAIL_USER")
            sender_password = os.getenv("EMAIL_PASSWORD")

            logger.info(f"sender_email: {sender_email} and sender_password: {sender_password}")
            logger.info(f"email: {email} and otp: {otp}")

            message = MIMEMultipart("alternative")
            message["Subject"] = "Password Reset OTP"
            message["From"] = f"GetaJob <{sender_email}>"
            message["To"] = email
            
            # Create HTML version of the email
            html = f"""
            <html>
              <body>
                <h2>GetaJob | Permintaan Reset Kata Sandi</h2>
                <p>Kode OTP (One-Time Password) Anda untuk mereset kata sandi adalah:</p>
                <h1 style="font-size: 24px; background-color: #f0f0f0; padding: 10px; text-align: center;">{otp}</h1>
                <p>Kode ini akan kedaluwarsa dalam 15 menit.</p>
                <p>Jika Anda tidak meminta reset kata sandi, silakan abaikan email ini atau hubungi dukungan.</p>
              </body>
            </html>
            """
            
            text_part = MIMEText("Your password reset OTP is: " + otp, "plain")
            html_part = MIMEText(html, "html")
            
            message.attach(text_part)
            message.attach(html_part)
            
            # Kirim Emailnya
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(sender_email, sender_password)
                server.sendmail(sender_email, email, message.as_string())
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending password reset email: {e}")
            return False
    
    async def verify_otp(self, email: str, otp: str) -> bool:
        """Verifikasi apakah OTP valid untuk email yang diberikan."""
        try:
            # Find the password reset record
            reset_record = await self.db.password_resets.find_one({
                "email": email,
                "otp": otp,
                "expires_at": {"$gt": datetime.now()}
            })
            
            return reset_record is not None
            
        except Exception as e:
            logger.error(f"Error verifying OTP: {e}")
            return False
    
    async def reset_password(self, email: str, otp: str, new_password: str) -> bool:
        """Reset password dari email apabila OTP valid."""
        try:
            # Verifikasi apakah OTP valid
            if not await self.verify_otp(email, otp):
                return False
            
            # Carilah user berdasarkan email dan OTP untuk mendapatkan user type
            reset_record = await self.db.password_resets.find_one({
                "email": email,
                "otp": otp
            })
            
            if not reset_record:
                return False
                
            user_type = reset_record.get("user_type")
            
            # Hash password barunya
            password_hash = get_password_hash(new_password)
            
            # Update user password based on user type
            collection = self.db.appliers if user_type == "applier" else self.db.recruiters
            result = await collection.update_one(
                {"email": email},
                {"$set": {"password_hash": password_hash}}
            )
            
            # Hapus OTP yang sudah digunakan
            await self.db.password_resets.delete_one({"email": email})
            
            return result.modified_count > 0
            
        except Exception as e:
            logger.error(f"Error resetting password: {e}")
            return False