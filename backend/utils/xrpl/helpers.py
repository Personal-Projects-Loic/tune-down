from xrpl.wallet import Wallet
from fastapi import HTTPException


def xrpl_verify_secret_with_address(secret: str, public_address: str) -> bool:
    wallet = Wallet.from_seed(secret)
    if (wallet.classic_address != public_address):
        raise HTTPException(
            status_code=400,
            detail="Wallet secret does not match with the registered address"
        )
