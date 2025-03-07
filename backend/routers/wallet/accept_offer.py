from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from db.database import get_db, AsyncSession
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent
from utils.xrpl.accept_offer import xrpl_accept_offer
from db.models import NFT
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

router = APIRouter()


class Request(BaseModel):
    nft_id: str
    private_key: str
    sell_offer_id: Optional[str] = None
    buy_offer_id: Optional[str] = None


class Response(BaseModel):
    success: bool


@router.post("/accept_offer", response_model=Response)
async def accept_offer(
    request: Request,
    db: AsyncSession = Depends(get_db),
    user: JWTContent = Depends(auth_middleware),
):

    nft_id = await xrpl_accept_offer(
        private_key=request.private_key,
        nft_id=request.nft_id,
        sell_offer_id=request.sell_offer_id,
        buy_offer_id=request.buy_offer_id,
    )
    print(f"xrpl_accept_offer returned: {nft_id}")  # Debug
    await db_update_nft_owner(db, nft_id, user.id)
    return Response(success=True)


async def db_update_nft_owner(
    db: AsyncSession,
    nft_id: str,
    new_owner_id: int
):
    # Get the NFT by nft_id
    result = await db.execute(select(NFT).where(NFT.nft_id == nft_id))
    nft = result.scalars().first()
    if not nft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NFT not found"
        )
    # Get the new owner to retrieve their wallet_id
    from db.models import User
    user_result = await db.execute(select(User).where(User.id == new_owner_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    # Update both user_id and wallet_id fields
    nft.user_id = new_owner_id
    nft.wallet_id = user.wallet_id  # Update the wallet_id from the user
    nft.price = 0
    try:
        await db.commit()
        # No refresh needed - just return the updated object
        return nft
    except IntegrityError as e:
        await db.rollback()
        print(f"IntegrityError: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update NFT owner due to integrity error"
        )
