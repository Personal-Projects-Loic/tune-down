from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from . import modelsDB, schemas

async def get_user_by_email(db: AsyncSession, email: str):
    query = select(modelsDB.User).filter(modelsDB.User.email == email)
    result = await db.execute(query)
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    db_user = modelsDB.User(email=user.email, password=user.password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user
