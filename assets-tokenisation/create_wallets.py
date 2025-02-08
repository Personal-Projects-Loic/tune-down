import os
import sys
from dotenv import load_dotenv
from xrpl.wallet import Wallet

load_dotenv()

def create_new_wallet():
    wallet = Wallet.create()
    # print(f"Adresse XRP : {wallet.classic_address}")
    # print(f"Clé privée : {wallet.seed}")
    return wallet

if (len(sys.argv) < 2):
    print("Usage: python create_wallets.py <wallet names>")
    sys.exit(1)

for i in range(1, len(sys.argv)):
    wallet = create_new_wallet()
    wallet_name = sys.argv[i].upper()
    print(f"{wallet_name}_PUBLIC={wallet.classic_address}")
    print(f"{wallet_name}_PRIVATE={wallet.seed}")
