import os
from pydantic import BaseModel
from xrpl.asyncio.transaction import submit_and_wait
from xrpl.wallet import Wallet
from xrpl.models.requests import NFTInfo
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.utils import str_to_hex, hex_to_str

XRPL_RPC_URL = os.getenv("XRPL_RPC_URL")


async def xrpl_get_nft(
    nft_id: str
):
    client = AsyncJsonRpcClient(XRPL_RPC_URL)
    nft_info = NFTInfo(nft_id=nft_id)
    result = await client.request(nft_info)
    return result
