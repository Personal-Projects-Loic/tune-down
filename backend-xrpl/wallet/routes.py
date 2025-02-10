from fastapi import APIRouter, HTTPException
from wallet.models import WalletResponse, WalletRequest, ValidationResponse
from wallet.wallet import generate_wallet, is_valid_xrpl_wallet

router = APIRouter()

@router.get("/generate-wallet", response_model=WalletResponse)
def generate_wallet_route():
    return generate_wallet()

@router.post("/validate-wallet", response_model=ValidationResponse)
async def validate_wallet_route(wallet_request: WalletRequest):
    print("prout")
    try:
        is_valid, message = is_valid_xrpl_wallet(
            wallet_request.classic_address,
            wallet_request.seed
        )
        return ValidationResponse(is_valid=is_valid, message=message)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
