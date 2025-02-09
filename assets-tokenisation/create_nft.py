import os
import sys
from dotenv import load_dotenv
from xrpl.models.transactions import NFTokenMint
from xrpl.wallet import Wallet
from xrpl.clients import JsonRpcClient
from xrpl.transaction import submit_and_wait
from xrpl.models.amounts.issued_currency_amount import IssuedCurrencyAmount
from xrpl.models.requests import GatewayBalances
from xrpl.utils import str_to_hex
from xrpl.models.transactions import NFTokenMintFlag

load_dotenv()

client = JsonRpcClient(os.getenv("JSON_RPC_URL"))

if (len(sys.argv) < 3):
    print("Usage: python create_nft.py <hot wallet name> <uri>")
    sys.exit(1)

minter_wallet = Wallet.from_secret(os.getenv(f"{sys.argv[1].upper()}_PRIVATE"))

uri = sys.argv[2]

flags = NFTokenMintFlag.TF_TRANSFERABLE | NFTokenMintFlag.TF_BURNABLE #| NFTokenMintFlag.TF_TRUSTLINE

mint_tx = NFTokenMint(
    account=minter_wallet.address,
    uri=str_to_hex(uri),
    flags=int(flags),
    nftoken_taxon=0
)

response = submit_and_wait(client=client, transaction=mint_tx, wallet=minter_wallet)

print(f"NFTokenMint Result: {response.result['meta']['TransactionResult']}")