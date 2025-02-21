import os
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.models.requests.account_info import AccountInfo
from fastapi import HTTPException
from pydantic import BaseModel

XRPL_RPC_URL = os.getenv("XRPL_RPC_URL")


class XRPLAccountInfo(BaseModel):
    address: str
    balance: str
    sequence: int
    ledger_index: int
    flags: int
    owner_count: int
    previous_txn_id: str
    previous_txn_lgr_seq: int


def parse_response(result: dict[str, any]) -> XRPLAccountInfo:
    return XRPLAccountInfo(
        address=result["account_data"]["Account"],
        balance=result["account_data"]["Balance"],
        sequence=result["account_data"]["Sequence"],
        ledger_index=result["ledger_current_index"],
        flags=result["account_data"]["Flags"],
        owner_count=result["account_data"]["OwnerCount"],
        previous_txn_id=result["account_data"]["PreviousTxnID"],
        previous_txn_lgr_seq=result["account_data"]["PreviousTxnLgrSeq"]
    )


def handle_error(result: dict[str, any]):
    error = result.get("error")
    if error == "actNotFound":
        raise HTTPException(
            status_code=404,
            detail="XRPL Wallet not found"
        )
    else:
        raise HTTPException(
            status_code=500,
            detail="Internal Server Error"
        )


async def xrpl_get_wallet(address: str):
    client = AsyncJsonRpcClient(XRPL_RPC_URL)
    accountInfos = AccountInfo(account=address)

    response = await client.request(accountInfos)

    if not response.is_successful():
        handle_error(response.result)

    return parse_response(response.result)
