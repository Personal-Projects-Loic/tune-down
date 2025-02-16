import asyncio
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.transactions import NFTokenMint
from xrpl.models.requests import AccountNFTs
from xrpl.models.transactions import NFTokenMintFlag
from xrpl.asyncio.transaction import submit_and_wait
from xrpl.utils import str_to_hex
from wallet.models import NFTCreationResponse
from fastapi import FastAPI, HTTPException


testnet_url = "https://s.altnet.rippletest.net:51234"

def parse_result(result: dict) -> NFTCreationResponse:
    return NFTCreationResponse(
        status="200",
        transaction_hash=result["hash"],
        # maybe we should get the new balance after the fees as well
    )

async def create_and_assign_nft(
    wallet_seed: str,
    uri: str,
    flags: int = NFTokenMintFlag.TF_BURNABLE | NFTokenMintFlag.TF_TRANSFERABLE,
    transfer_fee: int = 0,
    taxon: int = 0,
):
    wallet = Wallet.from_seed(wallet_seed)
    
    client = AsyncJsonRpcClient(testnet_url)
    
    nft_tx = NFTokenMint(
        account=wallet.classic_address,
        uri=str_to_hex(uri),
        flags=flags,
        transfer_fee=transfer_fee,
        nftoken_taxon=taxon
    )
    
    response = await submit_and_wait(nft_tx, client, wallet)

    return parse_result(response.result)
    
    # account_nfts_request = AccountNFTs(account=wallet.classic_address)
    # nfts_response = await client.request(account_nfts_request)
    # print("Wallet NFTs:")
    # print(nfts_response.result)        
