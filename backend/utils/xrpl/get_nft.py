import os
from xrpl.models.requests import AccountNFTs
from xrpl.asyncio.clients import AsyncJsonRpcClient
from xrpl.utils import hex_to_str
from utils.xrpl.helpers import NFTInfos

XRPL_RPC_URL = os.getenv("XRPL_RPC_URL")


def parse_nft_response(nft: dict[str, any], owner_wallet: str):
    return NFTInfos(
        flags=nft["Flags"],
        id=nft["NFTokenID"],
        issuer=nft["Issuer"],
        owner=owner_wallet,
        taxon=nft["NFTokenTaxon"],
        uri=hex_to_str(nft["URI"]),
        transfer_fee=0
    )


class NFTGetter:
    # nft_cache: dict[str, dict[str, dict]] = {}
    def __init__(self):
        self.nft_cache: dict[str, dict[str, dict]] = {}
        pass

    def __get_nft_from_cache(self, nft_id, nft_owner):
        if (self.nft_cache.get(nft_owner)):
            return parse_nft_response(self.nft_cache[nft_id], nft_owner)
        self.nft_cache[nft_owner] = {}
        return None

    def __find_nft_from_result(self, nft_id, nft_owner, result):
        res = None
        for nft in result["account_nfts"]:
            if (nft["NFTokenID"] == nft_id):
                res = parse_nft_response(nft, nft_owner)
            self.nft_cache[nft_owner][nft["NFTokenID"]] = nft
        return res

    async def xrpl_get_nft(
        self,
        nft_id: str,
        nft_owner: str
    ):
        client = AsyncJsonRpcClient(XRPL_RPC_URL)
        res = self.__get_nft_from_cache(nft_id, nft_owner)
        if (res):
            return res
        request = AccountNFTs(account=nft_owner)
        response = await client.request(request)

        return self.__find_nft_from_result(nft_id, nft_owner, response.result)
