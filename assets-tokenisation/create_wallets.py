import os
import sys
from dotenv import load_dotenv
from xrpl.wallet import generate_faucet_wallet
from xrpl.clients import JsonRpcClient

load_dotenv()

if (len(sys.argv) < 2):
    print("Usage: python create_wallets.py <wallet names>")
    sys.exit(1)

client = JsonRpcClient(os.getenv("JSON_RPC_URL"))

for i in range(1, len(sys.argv)):
    wallet = generate_faucet_wallet(client)
    wallet_name = sys.argv[i].upper()
    print(f"{wallet_name}_PUBLIC={wallet.classic_address}")
    print(f"{wallet_name}_PRIVATE={wallet.seed}")
