import os
import sys
from dotenv import load_dotenv
from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
from xrpl.transaction import submit_and_wait
from xrpl.wallet import Wallet
load_dotenv()

if (len(sys.argv) < 4):
    print("Usage: python transfer_xrps.py <sender wallet name> <receiver wallet name> <amount>")
    sys.exit(1)

client = JsonRpcClient(os.getenv("JSON_RPC_URL"))

# sender_wallet_public = os.getenv(f"{sys.argv[1].upper()}_PUBLIC")
sender_secret = os.getenv(f"{sys.argv[1].upper()}_PRIVATE")
sender_wallet = Wallet.from_secret(sender_secret)

receiver_wallet = os.getenv(f"{sys.argv[2].upper()}_PUBLIC")

amount = int(sys.argv[3])

payment = Payment(
    account=sender_wallet.classic_address,
    amount=xrp_to_drops(amount),
    destination=receiver_wallet
)

response = submit_and_wait(client=client, transaction=payment, wallet=sender_wallet)

print(f"Payment Result: {response.result['meta']['TransactionResult']}")

# Maybe add up some research about doing transactions using the X-address instead of the classic address