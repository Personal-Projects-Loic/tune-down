from fastapi import APIRouter, HTTPException
from wallet.models import WalletResponse, WalletRequest, ValidationResponse, PaymentResponse, PaymentRequest, AccountResponse, NFTCreationResponse, NFTCreationRequest, NFTs, NFTSellOfferResponse, NFTSellOfferRequest, NFTOffers
from wallet.wallet import generate_wallet, is_valid_xrpl_wallet, transfer_xrps
from wallet.account import fetch_account_info
from pydantic import BaseModel
from wallet.nfts.create_and_get import create_and_assign_nft, fetch_account_nfts
from wallet.nfts.nft_sell_offers import create_sell_offer, fetch_account_offers

router = APIRouter()

@router.get("/generate-wallet", response_model=WalletResponse)
def generate_wallet_route():
    return generate_wallet()

@router.post("/validate-wallet", response_model=ValidationResponse)
async def validate_wallet_route(wallet_request: WalletRequest):
    try:
        is_valid, message = is_valid_xrpl_wallet(
            wallet_request.classic_address,
            wallet_request.seed
        )

        print(ValidationResponse(
            is_valid=is_valid,
            message=message,
        ))

        return ValidationResponse(
            is_valid=is_valid,
            message=message,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/transfer-xrps", response_model=PaymentResponse)
async def transfer_xrps_route(payment_request: PaymentRequest):
    res =  await transfer_xrps(
        payment_request.sender_seed,
        payment_request.receiver_address,
        payment_request.amount
    )
    return PaymentResponse(
        status=res["status"],
        transaction_result=res.get("transaction_result"),
        transaction_hash=res.get("transaction_hash"),
        message=res.get("message")
    )

@router.get("/account-info/{public_key}", response_model=AccountResponse)
async def account_info_route(public_key: str):
    return await fetch_account_info(public_key)

@router.post("/create-nft", response_model=NFTCreationResponse)
async def create_and_assign_nft_route(nft_creation_request: NFTCreationRequest):
    res =  await create_and_assign_nft(
        nft_creation_request.wallet_seed,
        nft_creation_request.uri,
        # nft_creation_request.flags,
        # nft_creation_request.transfer_fee,
        # nft_creation_request.taxon
    )

    return res

@router.get("/get-nfts/{public_key}", response_model=NFTs)
async def get_nfts(public_key: str):
    return await fetch_account_nfts(public_key)

@router.post("/create-nft-sell-offer", response_model=NFTSellOfferResponse)
async def create_nft_offer(nft_offer_request: NFTSellOfferRequest):
    return await create_sell_offer(
        nft_offer_request.wallet_seed,
        nft_offer_request.nft_id,
        nft_offer_request.amount,
        nft_offer_request.destination,
        nft_offer_request.expiration
    );

@router.get("/get-nft-offers/{nft_id}", response_model=NFTOffers)
async def get_nft_offers(nft_id: str):
    return await fetch_account_offers(nft_id);