from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
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
    try:
        user = await db_get_user(db, user.id)
        if not user or not user.wallet_id:
            raise HTTPException(status_code=404, detail="User or wallet not found")

        wallet = await xrpl_get_wallet(user.wallet_id)
        if not wallet:
            raise HTTPException(status_code=404, detail="Wallet not found")

        return Response(**wallet.model_dump())
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
