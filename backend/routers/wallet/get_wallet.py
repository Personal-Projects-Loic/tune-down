from pydantic import BaseModel
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_db
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent
from utils.xrpl.get_wallet import xrpl_get_wallet
from db.helpers import db_get_user

router = APIRouter()


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


@router.get("/", response_model=Response)
async def get_wallet(
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    user = await db_get_user(db, user.id)
    wallet = await xrpl_get_wallet(user.wallet_id)
    print("wallet", wallet)
    return Response(**wallet.model_dump())
