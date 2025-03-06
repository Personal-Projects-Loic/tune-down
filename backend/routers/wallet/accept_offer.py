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

# TODO: Implement the function to update the owner of the NFT in the database
# await db_update_nft_owner(db, nft_id, user.user_id)


async def db_update_nft_owner(
    db: AsyncSession,
    nft_id: str,
    new_owner_id: int  # Doit être un int car user_id est un Integer
):
    # Rechercher le NFT par nft_id au lieu de id
    result = await db.execute(select(NFT).where(NFT.nft_id == nft_id))
    nft = result.scalars().first()
    
    if not nft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NFT not found"
        )
    
    # Mettre à jour le propriétaire du NFT
    nft.user_id = new_owner_id
    
    try:
        await db.commit()
        await db.refresh(nft)
        return nft
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update NFT owner due to integrity error"
        )

