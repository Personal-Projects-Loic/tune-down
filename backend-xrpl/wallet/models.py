from pydantic import BaseModel
from typing import Optional

class WalletResponse(BaseModel):
    public_key: str
    private_key: str

class WalletRequest(BaseModel):
    classic_address: str
    seed: str

class ValidationResponse(BaseModel):
    is_valid: bool
    message: str
    new_wallet: Optional[WalletResponse] = None
