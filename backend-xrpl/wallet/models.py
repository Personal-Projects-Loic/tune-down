from pydantic import BaseModel
from typing import Optional

class WalletResponse(BaseModel):
    id: str
    public_key: str
    private_key: str
    classic_address: str
    address: str

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

class AccountResponse(BaseModel):
    address: str
    balance: str
    sequence: int
    ledger_index: int
    flags: int
    owner_count: int
    previous_txn_id: str
    previous_txn_lgr_seq: int

class NFTCreationRequest(BaseModel):
    wallet_seed: str
    uri: str

class NFTCreationResponse(BaseModel):
    status: str
    transaction_hash: str
    message: Optional[str] = None
