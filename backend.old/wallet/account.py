from xrpl.clients import JsonRpcClient
import xrpl
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.models.requests.account_info import AccountInfo
from xrpl.asyncio.clients.exceptions import XRPLRequestFailureException
from wallet.models import AccountResponse

testnet_url = "https://s.altnet.rippletest.net:51234"

def parse_response_account_info_result(result: dict) -> AccountResponse:
    return AccountResponse(
        address=result["account_data"]["Account"],
        balance=str(int(result["account_data"]["Balance"]) / 1000000),
        sequence=result["account_data"]["Sequence"],
        ledger_index=result["ledger_current_index"],
        flags=result["account_data"]["Flags"],
        owner_count=result["account_data"]["OwnerCount"],
        previous_txn_id=result["account_data"]["PreviousTxnID"],
        previous_txn_lgr_seq=result["account_data"]["PreviousTxnLgrSeq"]
    )

def handle_error(result, accountInfos: AccountInfo):
    error = result["error"]
    errors = {
        "actMalformed": {
            "status_code": 400,
            "detail": f"Account {accountInfos.account} is malformed"
        },
        "actNotFound": {
            "status_code": 404,
            "detail": f"Account {accountInfos.account} not found on the XRPL"
        },    
    }

    exception = errors.get(error)
    raise HTTPException(
        status_code=exception["status_code"],
        detail=exception["detail"]
    )

async def fetch_account_info(address: str):
    client = AsyncJsonRpcClient(testnet_url)
    accountInfos = AccountInfo(account=address)

    response = await client.request(accountInfos)

    if not response.is_successful():
        handle_error(response.result, accountInfos)
    return parse_response_account_info_result(response.result)