from fastapi import APIRouter, HTTPException
from wallet.models import WalletResponse, WalletRequest, ValidationResponse, PaymentResponse, PaymentRequest
from wallet.wallet import generate_wallet, is_valid_xrpl_wallet, transfer_xrps

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
    try:
        result = await transfer_xrps(
            payment_request.sender_seed,
            payment_request.receiver_address,
            payment_request.amount
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
