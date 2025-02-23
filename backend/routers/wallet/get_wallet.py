from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status

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


@router.get(
    "/",
    response_model=WalletResponse, responses={
        204: {"description": "No wallet found"}
    }
)
async def get_wallet(
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    try:
        user = await db_get_user(db, user.id)
        if not user or not user.wallet_id:
            raise HTTPException(
                status_code=status.HTTP_204_NO_CONTENT,
                detail="No wallet found"
            )

        wallet = await xrpl_get_wallet(user.wallet_id)
        if not wallet:
            raise HTTPException(
                status_code=status.HTTP_204_NO_CONTENT,
                detail="No wallet found"
            )

        return WalletResponse(**wallet.model_dump())
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
