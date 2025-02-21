from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from db.models import User


async def db_get_user(db: AsyncSession, user_id: int):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user
