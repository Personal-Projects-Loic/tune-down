import os
from pydantic import BaseModel
from xrpl.asyncio.transaction import submit_and_wait
from xrpl.wallet import Wallet
from xrpl.models.transactions import NFTokenMintFlag
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.models.transactions import NFTokenMint
from xrpl.utils import str_to_hex, hex_to_str

from utils.xrpl.helpers import NFTInfos

XRPL_RPC_URL = os.getenv("XRPL_RPC_URL")


class NFTCreateResponse(BaseModel):
    nft: NFTInfos
    fee: int


async def get_nft_create_response_from_result(
    result: dict[str, any]
) -> NFTInfos:
    tx_json = result["tx_json"]
    return NFTCreateResponse(
        nft=NFTInfos(
            id=result["meta"]["nftoken_id"],
            issuer=tx_json["Account"],
            owner=tx_json["Account"],
            uri=hex_to_str(tx_json["URI"]),
            flags=tx_json["Flags"],
            transfer_fee=tx_json["TransferFee"],
            taxon=tx_json["NFTokenTaxon"],
        ),
        fee=int(tx_json["Fee"]),
    )


async def xrpl_create_nft(
    wallet_seed: str,
    uri: str,
    flags: int = NFTokenMintFlag.TF_BURNABLE | NFTokenMintFlag.TF_TRANSFERABLE,
    transfer_fee: int = 0,
    taxon: int = 0,
):
    try:
        print("xrpl_create_nft", wallet_seed, uri, flags, transfer_fee)
        client = AsyncJsonRpcClient(XRPL_RPC_URL)
        try:
            wallet = Wallet.from_seed(wallet_seed)
        except ValueError as e:
            # Catch specific seed validation errors
            error_message = str(e)
            print(f"Wallet seed error: {error_message}")
            return {
                "success": False,
                "error": "Invalid wallet seed format",
                "details": error_message,
                "status_code": 204
            }
        print("wallet addr", wallet)
        print("classic addr", wallet.classic_address)

        # Check if uri is a dictionary and handle it appropriately
        if isinstance(uri, dict):
            # Extract the URL from the dictionary if it exists
            if "url" in uri:
                uri = uri["url"]
            else:
                # Use a string representation or a default value
                uri = str(uri)
        tx = NFTokenMint(
            account=wallet.classic_address,
            flags=flags,
            transfer_fee=transfer_fee,
            nftoken_taxon=taxon,
            uri=str_to_hex(uri),
        )

        try:
            response = await submit_and_wait(tx, client, wallet)
            return await get_nft_create_response_from_result(response.result)
        except Exception as e:
            print(f"Transaction error: {str(e)}")
            return {
                "success": False,
                "error": "Failed to create NFT",
                "details": str(e)
            }
    except Exception as e:
        # Catch any other unexpected errors
        error_message = str(e)
        print(f"Unexpected error in xrpl_create_nft: {error_message}")
        return {
            "success": False,
            "error": "NFT creation failed",
            "details": error_message
        }
