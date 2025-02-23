from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import status, Query

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
    response_model=WalletResponse,
    responses={
        204: {"description": "No wallet found"},
        400: {"description": "Invalid wallet address"},
        404: {"description": "User not found"},
        500: {"description": "Internal server error"}
    }
)
async def get_wallet(
    wallet_id: str = Query(None, description=(
        "The wallet address to get the balance for"
    )),
    user: JWTContent = Depends(auth_middleware),
    db: AsyncSession = Depends(get_db)
):
    try:
        if wallet_id:
            wallet = await xrpl_get_wallet(wallet_id)
            if wallet is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid wallet address or no wallet found"
                )
            return WalletResponse(**wallet.model_dump())

        user = await db_get_user(db, user.id)
        if not user or not user.wallet_id:
            raise HTTPException(
                status_code=status.HTTP_204_NO_CONTENT,
                detail="No wallet found for the user"
            )

        wallet = await xrpl_get_wallet(user.wallet_id)
        if wallet is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid wallet address or no wallet found"
            )

        return WalletResponse(**wallet.model_dump())
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
