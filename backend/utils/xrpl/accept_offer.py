import os
from typing import Optional
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.models.transactions import NFTokenAcceptOffer
from xrpl.wallet import Wallet
from xrpl.asyncio.transaction import submit_and_wait

XRPL_RPC_URL = os.getenv("XRPL_RPC_URL")


async def xrpl_accept_offer(
    private_key: str,
    nft_id: str,
    sell_offer_id: Optional[str] = None,
    buy_offer_id: Optional[str] = None,
) -> str:
    client = AsyncJsonRpcClient(XRPL_RPC_URL)

    wallet = Wallet.from_seed(private_key)

    accept_tx = NFTokenAcceptOffer(
        account=wallet.classic_address,
        nftoken_sell_offer=sell_offer_id,
        nftoken_buy_offer=buy_offer_id
    )

    response = await submit_and_wait(accept_tx, client, wallet)
    return response.result["meta"].get("nftoken_id")
