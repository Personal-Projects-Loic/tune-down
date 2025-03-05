from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from db.database import get_db, AsyncSession
from middlewares.auth import auth_middleware
from utils.jwt import JWTContent
from utils.xrpl.accept_offer import xrpl_accept_offer
from db.models import NFT
from sqlalchemy.future import select

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
    if not request.sell_offer_id and not request.buy_offer_id:
        raise HTTPException(
            status_code=400,
            detail="Either sell_offer_id or buy_offer_id must be provided"
        )

    try:
        nft_id = await xrpl_accept_offer(
            private_key=request.private_key,
            nft_id=request.nft_id,
            sell_offer_id=request.sell_offer_id,
            buy_offer_id=request.buy_offer_id,
        )

        await db_update_nft_owner(db, nft_id, user.user_id)

        return Response(success=True)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred: {str(e)}"
        )

# TODO: Implement the function to update the owner of the NFT in the database
# await db_update_nft_owner(db, nft_id, user.user_id)


async def db_update_nft_owner(
    db: AsyncSession,
    nft_id: str,
    new_owner_id: str
):
    try:
        result = await db.execute(select(NFT).filter_by(id=nft_id))
        nft = result.scalar_one_or_none()

        if nft:
            nft.owner_id = new_owner_id
            await db.commit()
        else:
            raise ValueError("NFT not found")

    except Exception as e:
        await db.rollback()
        raise e
