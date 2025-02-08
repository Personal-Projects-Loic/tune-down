import os
import sys
from dotenv import load_dotenv
from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountInfo

load_dotenv()

client = JsonRpcClient(os.getenv("JSON_RPC_URL"))

if (len(sys.argv) < 2):
    print("Usage: python get_wallet_info.py <wallet names>")
    sys.exit(1)


for i in range(1, len(sys.argv)):
    wallet_address = os.getenv(f"{sys.argv[i].upper()}_PUBLIC")

    account_info = AccountInfo(
        account=wallet_address,
        ledger_index="validated"
    )

    response = client.request(account_info)

    print(f"Wallet: {sys.argv[i].upper()}")
    print(f"\tBalance: {response.result['account_data']['Balance']}")
    print(f"\tSequence: {response.result['account_data']['Sequence']}")