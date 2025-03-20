import os
import random
import logging
import smtplib
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Union, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from fastapi import Depends, Request, Response, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext
from secrets import token_hex
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.models.auth_model import Token, TokenData, UserResponse
from app.utils.common_fn import convert_date_to_datetime
from app.utils.auth_helper import SECRET_KEY, oauth2_scheme, get_password_hash, verify_password, create_access_token, create_refresh_token
from app.utils.constants import OTP_EXPIRED_MINUTES, ACCESS_TOKEN_EXPIRE_MINUTES, JWT_ALGORITHM, REFRESH_TOKEN_EXPIRE_DAYS
from app.controllers.applier_controller import ApplierController
from app.controllers.recruiter_controller import RecruiterController

logger = logging.getLogger(__name__)

class AuthController:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database
        self.applier_controller = ApplierController(database)
        self.recruiter_controller = RecruiterController(database)

    async def send_password_reset_email(self, email: str, request: Request) -> bool:
        """
        Menggenerate OTP dan mengirim email reset password.
        Mengembalikan True jika email berhasil dikirim.
        """
        ip_address = request.client.host
        await self.log_password_reset_request(email, ip_address)
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
    
    async def reset_password(self, email: str, otp: str, new_password: str, request: Request) -> bool:
        """Reset password dari email apabila OTP valid."""
        try:
            ip_address = request.client.host
            is_valid = await self.verify_otp(email, otp)
            await self.log_otp_verification(email, ip_address, is_valid)
            # Verifikasi apakah OTP valid
            if not is_valid:
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
        
    async def authenticate_user(self, identifier: str, password: str) -> Union[UserResponse, None]:
        """Autentikasi user berdasarkan email dan password."""
        try:
            # Try to find user in appliers collection
            applier = await self.db.appliers.find_one({"username": identifier})
            if not applier:
                applier = await self.db.appliers.find_one({"email": identifier})
            if applier and verify_password(password, applier["password_hash"]):
                return UserResponse(
                    id=str(applier["_id"]),
                    username=applier["username"],
                    name=applier["name"],
                    email=applier["email"],
                    user_type="applier"
                )
                
            # If not found or password doesn't match, try recruiters collection
            recruiter = await self.db.recruiters.find_one({"username": identifier})
            if not recruiter:
                recruiter = await self.db.recruiters.find_one({"email": identifier})
            if recruiter and verify_password(password, recruiter["password_hash"]):
                return UserResponse(
                    id=str(recruiter["_id"]),
                    username=recruiter["username"],
                    name=recruiter["company_name"],
                    email=recruiter["email"], 
                    user_type="recruiter"
                )
                
            # If neither found or passwords don't match
            return None
            
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None
        
    async def login_user(self, identifier: str, password: str, request: Request, response: Response) -> Token:
        """Login user dan set HTTP-only cookie untuk authentication."""
        ip_address = request.client.host
        user = await self.authenticate_user(identifier, password)

        success = user is not None
        await self.log_login_attempt(identifier, ip_address, success)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Buat token data
        token_data = {
            "sub": user.id,
            "user_type": user.user_type
        }

        # Buat token
        access_token = create_access_token(
            data = token_data,
            expires_delta = timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        refresh_token = create_refresh_token(data = token_data)

        # Set HttpOnly cookies
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            samesite="lax",
            secure=False,  # Jika pakai HTTPS set true
        )
        
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            expires=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            samesite="lax",
            secure=False,  # Jika pakai HTTPS set true
        )

        # Return user data without tokens
        return UserResponse(
            id=user.id,
            username=user.username,
            name=user.name,
            email=user.email,
            user_type=user.user_type
        )
        
    async def refresh_token(self, request: Request, response: Response) -> Token:
        """Membuat token baru menggunakan token refresh dengan HTTPOnly Cookie."""
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token missing",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        try:
            # Decode refresh token
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
            user_id = payload.get("sub")
            user_type = payload.get("user_type")

            if user_id is None or user_type is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            # Buat token data
            token_data = {
                "sub": user_id,
                "user_type": user_type
            }

            # Buat token baru
            new_access_token = create_access_token(
                data=token_data,
                expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            )
            new_refresh_token = create_refresh_token(data=token_data)

            # Set HttpOnly cookies
            response.set_cookie(
                key="access_token",
                value=f"Bearer {new_access_token}",
                httponly=True,
                max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                samesite="lax",
                secure=False,
            )
            
            response.set_cookie(
                key="refresh_token",
                value=new_refresh_token,
                httponly=True,
                max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
                expires=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
                samesite="lax",
                secure=False,
            )

            return {"message": "Tokens refreshed successfully"}
        
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
                headers={"WWW-Authenticate": "Bearer"},
            )

    async def logout(self, response: Response):
        """Logout user dengan clear authentication cookies."""
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token")
        return {"message": "Logged out successfully"}

    async def get_current_user(self, request: Request) -> UserResponse:
        """Mendapatkan data user yang sedang login dengan HTTPOnly Cookies."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        auth_cookie = request.cookies.get("access_token")
        if not auth_cookie:
            raise credentials_exception
        
        try:
            # Extract token from cookie
            scheme, token = auth_cookie.split()
            if scheme.lower() != "bearer":
                raise credentials_exception
            
            # Decode token
            payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
            user_id = payload.get("sub")
            user_type = payload.get("user_type")
            
            if user_id is None or user_type is None:
                raise credentials_exception
                
            token_data = TokenData(user_id=user_id, user_type=user_type)
            
        except (JWTError, ValueError):
            raise credentials_exception
        
        if token_data.user_type == "applier":
            try:
                user = await self.applier_controller.get_applier(token_data.user_id)
                return UserResponse(
                    id=token_data.user_id,
                    username=user.username,
                    name=user.name,
                    email=user.email,
                    user_type="applier"
                )
            except HTTPException:
                raise credentials_exception
            
        elif token_data.user_type == "recruiter":
            try:
                user = await self.recruiter_controller.get_recruiter(token_data.user_id)
                return UserResponse(
                    id=token_data.user_id,
                    username=user.username,
                    name=user.company_name,
                    email=user.email,
                    user_type="recruiter"
                )
            except HTTPException:
                raise credentials_exception
        else:
            raise credentials_exception
        
    # Part: Security Logging
    async def log_login_attempt(self, email: str, ip_address: str, success: bool):
        """Log percobaan login ke database."""
        event = {
            "timestamp": datetime.now(),
            "event_type": "login_attempt",
            "email": email,
            "ip_address": ip_address,
            "success": success
        }
        await self.db.security_logs.insert_one(event)
        
        log_level = logging.INFO if success else logging.WARNING
        logger.log(
            log_level, 
            f"Login attempt - Email: {email}, IP: {ip_address}, Success: {success}"
        )

    async def log_password_reset_request(self, email: str, ip_address: str):
        """Log password reset requests untuk keamanan."""
        event = {
            "timestamp": datetime.now(),
            "event_type": "password_reset_request",
            "email": email,
            "ip_address": ip_address
        }
        await self.db.security_logs.insert_one(event)
        logger.info(f"Password reset requested - Email: {email}, IP: {ip_address}")

    async def log_otp_verification(self, email: str, ip_address: str, success: bool):
        """Log percobaan verifikasi OTP."""
        event = {
            "timestamp": datetime.now(),
            "event_type": "otp_verification",
            "email": email,
            "ip_address": ip_address,
            "success": success
        }
        await self.db.security_logs.insert_one(event)
        
        log_level = logging.INFO if success else logging.WARNING
        logger.log(
            log_level, 
            f"OTP verification - Email: {email}, IP: {ip_address}, Success: {success}"
        )