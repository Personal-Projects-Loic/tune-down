import os
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.wallet import Wallet
from xrpl.asyncio.transaction import submit_and_wait
from xrpl.models.transactions import NFTokenCreateOffer
from xrpl.models.transactions.nftoken_create_offer import NFTokenCreateOfferFlag
from xrpl.constants import XRPLException
from pydantic import BaseModel
from fastapi import HTTPException

XRPL_RPC_URL = os.getenv("XRPL_RPC_URL")

ERROR_MAPPING = {
    "temDISABLED": (
        503, "The NonFungibleTokensV1 amendment is not enabled."),
    "temBAD_AMOUNT": (
        400, "The Amount field is not valid."),
    "temBAD_EXPIRATION": (
        400, "The specified Expiration time is invalid."),
    "tecDIR_FULL": (
        429, "The sender already owns too many objects in the ledger."),
    "tecEXPIRED": (
        410, "The specified Expiration time has already passed."),
    "tecFROZEN": (
        403, "The trust line is frozen."),
    "tecINSUFFICIENT_RESERVE": (
        402, "Insufficient XRP to meet the reserve requirement."),
    "tecNO_DST": (
        404, "The destination account does not exist."),
    "tecNO_ENTRY": (
        404, "The NFToken is not owned by the expected account."),
    "tecNO_ISSUER": (
        404, "The issuer specified in the Amount field does not exist."),
    "tecNO_LINE": (
        404, "The issuer does not have a trust line for the tokens."),
    "tecNO_PERMISSION": (
        403, "The destination account blocks incoming NFTokenOffers."),
    "tecUNFUNDED_OFFER": (
        402, "The sender does not have the funds"
             "specified in the Amount field."),
    "tefNFTOKEN_IS_NOT_TRANSFERABLE": (
        403, "The NFToken is not transferable."),
}


class NFTOffer(BaseModel):
    account: str
    nft_id: str
    price: float
    is_sell_offer: bool


def parse_result(result) -> NFTOffer:
    tx_json = result.get("tx_json")
    is_sell_offer = bool(tx_json.get("Flags", 0) & 1)
    amount_in_xrp = int(tx_json.get("Amount", 0)) / (10**6)

    return NFTOffer(
        account=tx_json.get("Account"),
        nft_id=tx_json.get("NFTokenID"),
        price=amount_in_xrp,
        is_sell_offer=is_sell_offer
    )


def handle_error(error_result: XRPLException):
    error_str = error_result.args[0]
    for key, value in ERROR_MAPPING.items():
        if key not in error_str:
            continue
        status_code, message = value
        raise HTTPException(status_code=status_code, detail=message)
    raise HTTPException(status_code=500, detail="An unknown error occurred.")


async def xrpl_create_offer(
    wallet_seed: str,
    nft_id: str,
    amount: float,
    is_sell_offer: bool,
    owner: str = None,
    destination: str = None,
    expiration: int = None
):
    client = AsyncJsonRpcClient(XRPL_RPC_URL)

    wallet = Wallet.from_seed(wallet_seed)
    flags = NFTokenCreateOfferFlag.TF_SELL_NFTOKEN if is_sell_offer else 0

    offer_tx = NFTokenCreateOffer(
        account=wallet.classic_address,
        flags=flags,
        nftoken_id=nft_id,
        amount=str(int(amount * (10**6))),
        destination=destination,
        expiration=expiration,
        owner=owner
    )
    response = None
    try:
        response = await submit_and_wait(offer_tx, client, wallet)
    except XRPLException as e:
        print("aze", e)
        handle_error(e)
    return parse_result(response.result)
