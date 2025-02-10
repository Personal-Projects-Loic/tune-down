from fastapi import APIRouter, HTTPException
from wallet.models import WalletResponse, WalletRequest, ValidationResponse
from wallet.wallet import generate_wallet, is_valid_xrpl_wallet

router = APIRouter()

@router.get("/generate-wallet", response_model=WalletResponse)
def generate_wallet_route():
    return generate_wallet()

@router.post("/validate-wallet", response_model=ValidationResponse)
async def validate_wallet_route(wallet_request: WalletRequest):
    try:
        # Valider le wallet
        is_valid, message = is_valid_xrpl_wallet(
            wallet_request.classic_address,
            wallet_request.seed
        )

        # Si le wallet est valide, générer un nouveau wallet
        new_wallet = None
        if is_valid:
            new_wallet = generate_wallet()

        return ValidationResponse(
            is_valid=is_valid,
            message=message,
            new_wallet=new_wallet  # Ajouter le nouveau wallet à la réponse
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
