from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Response as FastAPIResponse
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_db
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent
from utils.xrpl.get_wallet import xrpl_get_wallet
from db.helpers import db_get_user

router = APIRouter()

class WalletResponse(BaseModel):
    address: str
    balance: str
    sequence: int
    ledger_index: int
    flags: int
    owner_count: int
    previous_txn_id: str
    previous_txn_lgr_seq: int
    sufficient_balance: bool

@router.get("/", response_model=WalletResponse, responses={204: {"description": "No wallet found"}})
async def get_wallet(
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    try:
        user = await db_get_user(db, user.id)
        if not user or not user.wallet_id:
            return FastAPIResponse(status_code=204)

        wallet = await xrpl_get_wallet(user.wallet_id)
        if not wallet:
            return FastAPIResponse(status_code=204)

        return WalletResponse(**wallet.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
