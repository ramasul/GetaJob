from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, Request, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from app.config.db import Database
from app.controllers.auth_controller import AuthController
from app.models.auth_model import *
from app.utils.auth_helper import oauth2_scheme

router = APIRouter(prefix="/auth", tags=["Authentication"])

async def get_auth_controller() -> AuthController:
    """Dependency untuk mendapatkan instance AuthController."""
    db = Database.get_db()
    return AuthController(db)

@router.post("/login", response_model=Token)
async def login(
    form_data: LoginRequest,
    ip_request: Request,
    controller: AuthController = Depends(get_auth_controller)
):
    """Login dengan username/email dan password."""
    token = await controller.login_user(form_data.identifier, form_data.password, ip_request)
    return token

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: str = Body(..., embed=True),
    controller: AuthController = Depends(get_auth_controller)
):
    """Refresh access token menggunakan refresh token."""
    token = await controller.refresh_token(refresh_token)
    return token

@router.get("/me", response_model=UserResponse)
async def get_current_user(
    controller: AuthController = Depends(get_auth_controller),
    token: str = Depends(oauth2_scheme)
):
    """Mendapatkan data user yang sedang login."""
    user = await controller.get_current_user(token)
    return user



# Forget password

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    ip_request: Request,
    controller: AuthController = Depends(get_auth_controller)
):
    """Merequest reset password dengan email."""
    success = await controller.send_password_reset_email(request.email, ip_request)
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
    ip_request: Request,
    controller: AuthController = Depends(get_auth_controller)
):
    """Reset password dengan email dan OTP."""
    success = await controller.reset_password(
        request.email, 
        request.otp, 
        request.new_password,
        ip_request
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to reset password. Invalid or expired OTP."
        )
    
    return {"message": "Password reset successfully"}