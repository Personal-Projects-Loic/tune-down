import os
import sys
from dotenv import load_dotenv
from xrpl.models.transactions import NFTokenMint
from xrpl.wallet import Wallet
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountNFTs
from xrpl.models.amounts.issued_currency_amount import IssuedCurrencyAmount
from xrpl.utils import hex_to_str
from xrpl.models.transactions import NFTokenMintFlag

load_dotenv()

client = JsonRpcClient(os.getenv("JSON_RPC_URL"))

if (len(sys.argv) < 2):
    print("Usage: python get_nfts.py <hot wallet name>")
    sys.exit(1)

public_address = os.getenv(f"{sys.argv[1].upper()}_PUBLIC") 

account_nfts = AccountNFTs(
    account=public_address,
    ledger_index="validated"
)

response = client.request(account_nfts)

print(f"raw response: {response.result}", end="\n\n")

for nft in response.result["account_nfts"]:
    print(f"Token ID: {nft['NFTokenID']}")
    print(f"\tURI: {hex_to_str(nft['URI'])}")
    print(f"\tIssuer: {nft['Issuer']}")
    print(f"\tSerial: {nft['nft_serial']}")
    print(f"\tFlags: {nft['Flags']}")