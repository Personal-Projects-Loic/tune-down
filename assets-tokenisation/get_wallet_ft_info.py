import os
import sys
from dotenv import load_dotenv
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.models.requests import GatewayBalances

load_dotenv()

client = JsonRpcClient(os.getenv("JSON_RPC_URL"))

if (len(sys.argv) < 3):
    print("Usage: python get_wallet_info.py <cold wallet> <hot wallet names>")
    sys.exit(1)

cold_wallet_public = os.getenv(f"{sys.argv[1].upper()}_PUBLIC")
# cold_wallet = Wallet.from_secret(cold_wallet_secret)

hot_wallets = list(map(lambda wallet: os.getenv(f"{wallet.upper()}_PUBLIC"), sys.argv[2:]))

gateaway_balances = GatewayBalances(
    account=cold_wallet_public,
    ledger_index="validated",
    hotwallet=hot_wallets
)

response = client.request(gateaway_balances)

print(f"raw response: {response.result}", end="\n\n")

for index,hot_wallet in enumerate(hot_wallets):

    print(f"{sys.argv[2 + index]}: {hot_wallet}")
    # print(f"\tBalance: {response.result['balances'][hot_wallet]}")
    for i in response.result['balances'][hot_wallet]:
        print(f"\t{i["value"]} {i["currency"]}")