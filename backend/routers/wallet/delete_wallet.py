from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from db.database import get_db
from db.models import User
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent

router = APIRouter()


class DeleteWalletResponse(BaseModel):
    message: str


async def db_delete_wallet_id(
    db: AsyncSession,
    user_id: int
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    user.wallet_id = None
    try:
        await db.commit()
        await db.refresh(user)
        return user
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete wallet_id due to integrity error"
        )


@router.delete("/delete_wallet", response_model=DeleteWalletResponse)
async def delete_wallet(
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    await db_delete_wallet_id(db, user.id)
    return DeleteWalletResponse(message="Wallet deleted successfully")
