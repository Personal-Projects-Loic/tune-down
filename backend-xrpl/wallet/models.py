from pydantic import BaseModel
from typing import Optional

class WalletResponse(BaseModel):
    id: str
    public_key: str
    private_key: str

class WalletRequest(BaseModel):
    classic_address: str
    seed: str

class ValidationResponse(BaseModel):
    is_valid: bool
    message: str

class PaymentRequest(BaseModel):
    sender_seed: str
    receiver_address: str
    amount: int

class PaymentResponse(BaseModel):
    status: str
    transaction_result: Optional[str] = None
    transaction_hash: Optional[str] = None
    message: Optional[str] = None
