from xrpl.clients import JsonRpcClient
import xrpl
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.models.requests.account_info import AccountInfo
from xrpl.asyncio.clients.exceptions import XRPLRequestFailureException

testnet_url = "https://s.altnet.rippletest.net:51234"

class AccountResponse(BaseModel):
    address: str
    balance: str
    sequence: int
    ledger_index: int
    flags: int
    owner_count: int
    previous_txn_id: str
    previous_txn_lgr_seq: int

async def fetch_account_info(address: str):
    try:
        client = AsyncJsonRpcClient(testnet_url)

        accountInfos = AccountInfo(account=address)
        response = await client.request(accountInfos)
        result = response.result
        
        if 'error' in result:
            raise HTTPException(
                status_code=500,
                detail=f"XRPL request failed: {result['error']}"
            )

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
    except XRPLRequestFailureException as xrpl_error:
            # Gestion des erreurs spécifiques XRPL
            if "actNotFound" in str(xrpl_error):
                raise HTTPException(
                    status_code=404,
                    detail=f"Account {address} not found on the XRPL"
                )
            elif "invalidParams" in str(xrpl_error):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid parameters in the request"
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"XRPL request failed: {str(xrpl_error)}"
                )


async def get_account_info(address: str):
    try:
        # Connect to the XRPL network using async client
        async with AsyncJsonRpcClient(testnet_url) as client:
            # Create an AccountInfo request
            account_info_request = AccountInfo(
                account=address,
                ledger_index="validated",
                strict=True
            )

            # Send request and get response
            response = await client.request(account_info_request)
            
            # Extract account data
            account_data = response.result["account_data"]
            
            return AccountResponse(
                address=account_data["Account"],
                balance=str(int(account_data["Balance"]) / 1000000),  # Convert drops to XRP
                sequence=account_data["Sequence"],
                ledger_index=response.result["ledger_index"],
                flags=account_data["Flags"],
                owner_count=account_data["OwnerCount"],
                previous_txn_id=account_data["PreviousTxnID"],
                previous_txn_lgr_seq=account_data["PreviousTxnLgrSeq"]
            )

    except xrpl.clients.XRPLRequestFailureException as e:
        if "Account not found" in str(e):
            raise HTTPException(status_code=404, detail="Account not found")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
