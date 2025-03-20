from fastapi import Depends, HTTPException, status
from typing import List

from app.utils.auth_helper import oauth2_scheme
from app.controllers.auth_controller import AuthController

# Membuat dependency permission
async def get_current_active_user(user = Depends(AuthController.get_current_user)):
    """Mendapatkan user yang sedang aktif."""
    return user

async def recruiter_only(user = Depends(get_current_active_user)):
    """Memastikan user adalah recruiter."""
    if user.user_type != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Recruiter access required."
        )
    return user

async def applier_only(user = Depends(get_current_active_user)):
    """Memastikan user adalah applier."""
    if user.user_type != "applier":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Applier access required."
        )
    return user

async def is_owner(user_id: str, user = Depends(get_current_active_user)):
    """Cek apakah user adalah pemilik data."""
    if user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You are not authorized to view or modify this resource."
        )
    return user
