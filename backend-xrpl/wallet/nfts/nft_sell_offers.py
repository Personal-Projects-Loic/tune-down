import asyncio
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.wallet import Wallet
from xrpl.asyncio.transaction import submit_and_wait
from wallet.models import NFTs
from fastapi import HTTPException
from xrpl.models.transactions import NFTokenCreateOffer
from xrpl.models.transactions.nftoken_create_offer import NFTokenCreateOfferFlag
from xrpl.models.requests import NFTSellOffers
from wallet.models import NFTSellOfferResponse, NFTOffers, NFTOffer

testnet_url = "https://s.altnet.rippletest.net:51234"

def parse_result(result: dict) -> NFTSellOfferResponse:
    return NFTSellOfferResponse(
        status="200",
        transaction_hash=result["hash"],
        # maybe we should get the new balance after the fees as well
    )

async def create_sell_offer(
    wallet_seed: str,
    nft_id: str,
    amount: int,
    destination: str = None,
    expiration: int = None
):
    wallet = Wallet.from_seed(wallet_seed)
    
    client = AsyncJsonRpcClient(testnet_url)
    
    sell_offer_tx = NFTokenCreateOffer(
        account=wallet.classic_address,
        flags=NFTokenCreateOfferFlag.TF_SELL_NFTOKEN,
        nftoken_id=nft_id,
        amount=str(amount),
        destination=destination,
        expiration=expiration
    )
    
    response = await submit_and_wait(sell_offer_tx, client, wallet)

    print(response.result)
    return parse_result(response.result)

def parse_offers(offers: dict) -> list[dict]:
    return [
        NFTOffer(
            offer_id=offer["nft_offer_index"],
            nft_id=offers["nft_id"],
            amount=offer["amount"],
            destination=offer.get("destination"),
            expiration=offer.get("expiration")
        )
        for offer in offers["offers"]
    ]

async def fetch_account_offers(nft_id: str):
    print("address", nft_id)
    client = AsyncJsonRpcClient(testnet_url)
    account_offers_request = NFTSellOffers(nft_id=nft_id)
    offers_response = await client.request(account_offers_request)

    print(offers_response.result)

    if not offers_response.is_successful():
        raise HTTPException(status_code=400, detail="Error while fetching offers")

    offers_list = parse_offers(offers_response.result)

    return NFTOffers(
        status="200",
        offers=offers_list
    )