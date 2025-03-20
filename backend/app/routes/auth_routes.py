from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Query, HTTPException, status

from app.config.db import Database
from app.controllers.auth_controller import AuthController
from app.models.auth_model import *

router = APIRouter(prefix="/auth", tags=["authentication"])

async def get_auth_controller() -> AuthController:
    """Dependency untuk mendapatkan instance AuthController."""
    db = Database.get_db()
    return AuthController(db)

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    controller: AuthController = Depends(get_auth_controller)
):
    """Merequest reset password dengan email."""
    success = await controller.send_password_reset_email(request.email)
    # Selalu kembalikan message yang sama, biar user tidak tahu apakah email ada di database atau tidak
    return {"message": "If your email is registered, you will receive a password reset OTP"}

@router.post("/verify-otp")
async def verify_otp(
    request: VerifyOTPRequest,
    controller: AuthController = Depends(get_auth_controller)
):
    """Verifikasi OTP yang dikirim ke email."""
    is_valid = await controller.verify_otp(request.email, request.otp)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )
    return {"message": "OTP verified successfully"}

@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    controller: AuthController = Depends(get_auth_controller)
):
    """Reset password dengan email dan OTP."""
    success = await controller.reset_password(
        request.email, 
        request.otp, 
        request.new_password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to reset password. Invalid or expired OTP."
        )
    
    return {"message": "Password reset successfully"}