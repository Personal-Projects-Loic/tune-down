import os

from fastapi import HTTPException
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.models.requests import NFTSellOffers, NFTBuyOffers

from utils.xrpl.create_offer import NFTOffer

XRPL_RPC_URL = os.getenv("XRPL_RPC_URL")
ERROR_MAPPING = {
    "invalidParams": (
        400,
        "Invalid request parameters."),
    "objectNotFound": (
        404,
        "NFT not found or doesn't have any of the requested offers."),
}


def parse_result(result, is_sell_offer):
    return [
        NFTOffer(
            account=offer.get("owner"),
            nft_id=result.get("nft_id"),
            is_sell_offer=is_sell_offer,
            price=int(offer.get("amount")) / (10**6),
            offer_id=offer.get("nft_offer_index")
        ) for offer in result["offers"]]


def parse_error(result):
    error = result.get("error")
    if error in ERROR_MAPPING.keys():
        status, message = ERROR_MAPPING[error]
        raise HTTPException(
            status_code=status,
            detail=message
        )
    raise HTTPException(
        status_code=500,
        detail="Internal server error"
    )


async def xrpl_get_sell_offers(
    nft_id: str,
):
    client = AsyncJsonRpcClient(XRPL_RPC_URL)

    request = NFTSellOffers(
        nft_id=nft_id
    )

    response = await client.request(request)

    if (not response.is_successful()):
        parse_error(response.result)

    return parse_result(response.result, True)


async def xrpl_get_buy_offers(
    nft_id: str,
):
    client = AsyncJsonRpcClient(XRPL_RPC_URL)

    request = NFTBuyOffers(
        nft_id=nft_id
    )

    response = await client.request(request)

    if (not response.is_successful()):
        parse_error(response.result)

    return parse_result(response.result, False)
