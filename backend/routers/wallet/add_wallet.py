from pydantic import BaseModel, field_validator
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from routers.validators import validate_wallet_id
from db.database import get_db
from db.models import User
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent
from utils.xrpl.get_wallet import xrpl_get_wallet

router = APIRouter()


class Request(BaseModel):
    wallet_id: str

    @field_validator('wallet_id')
    def wallet_id_validation(cls, v):
        return validate_wallet_id(v)


class Response(BaseModel):
    address: str
    balance: str
    sequence: int
    ledger_index: int
    flags: int
    owner_count: int
    previous_txn_id: str
    previous_txn_lgr_seq: int
    sufficient_balance: bool


async def db_update_wallet_id(
    db: AsyncSession,
    user_id: int,
    new_wallet_id: str
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    user.wallet_id = new_wallet_id
    try:
        await db.commit()
        await db.refresh(user)
        return user
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update wallet_id due to integrity error"
        )


@router.post("/add_wallet", response_model=Response)
async def add_wallet(
    request: Request,
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    wallet = await xrpl_get_wallet(request.wallet_id)
    await db_update_wallet_id(db, user.id, request.wallet_id)
    return Response(**wallet.model_dump())
