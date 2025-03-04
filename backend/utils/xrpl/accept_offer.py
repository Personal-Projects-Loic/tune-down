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
):
    client = AsyncJsonRpcClient(XRPL_RPC_URL)

    wallet = Wallet.from_seed(private_key)

    accept_tx = NFTokenAcceptOffer(
        account=wallet.classic_address,
        nftoken_sell_offer=sell_offer_id,
        nftoken_buy_offer=buy_offer_id
    )
    response = None
    response = await submit_and_wait(accept_tx, client, wallet)
    # response = await client.submit_transaction(accept_tx, wallet)
    # TODO : Check if the parsing of token id is right
    # return parse_result(response.result)
    # return parse_result(response.result)
    return response.result["meta"]["nftoken_id"]
