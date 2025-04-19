from fastapi import Depends, HTTPException, Path, status

from app.config.db import Database
from app.utils.auth_helper import oauth2_scheme
from app.controllers.auth_controller import AuthController

# Membuat dependency permission
async def get_auth_controller() -> AuthController:
    """Dependency untuk mendapatkan instance AuthController."""
    db = Database.get_db()
    return AuthController(db)

async def get_current_active_user(
    token: str = Depends(oauth2_scheme),
    auth_controller: AuthController = Depends(get_auth_controller)
):
    """Mendapatkan user yang sedang aktif."""
    user = await auth_controller.get_current_user(token)
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

def owner_of(user_id_param: str, required_user_type: str):
    """Creates a dependency that checks if user owns the resource and has correct type."""
    async def check_owner(
        user = Depends(get_current_active_user),
        user_id: str = Path(..., alias=user_id_param)
    ):
        if user.id != user_id or user.user_type != required_user_type:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. You are not authorized to view or modify this resource."
            )
        return user
    return check_owner
