import os
import sys
from dotenv import load_dotenv
from xrpl.models.transactions import AccountSet, AccountSetAsfFlag, TrustSet, Payment
from xrpl.wallet import Wallet
from xrpl.clients import JsonRpcClient
from xrpl.transaction import submit_and_wait
from xrpl.models.amounts.issued_currency_amount import IssuedCurrencyAmount
from xrpl.models.requests import GatewayBalances

load_dotenv()

client = JsonRpcClient(os.getenv("JSON_RPC_URL"))

if (len(sys.argv) < 5):
    print("Usage: python ft_creation.py <cold wallet name> <hot wallet name> <currency> <ammount>")
    sys.exit(1)

cold_wallet_secret = os.getenv(f"{sys.argv[1].upper()}_PRIVATE")
cold_wallet = Wallet.from_seed(cold_wallet_secret)

cold_settings_transaction = AccountSet(
    account=cold_wallet.address,
    transfer_rate=0,
    tick_size=5,
    domain=bytes.hex("tune-down.fr".encode("ASCII")),
    set_flag=AccountSetAsfFlag.ASF_DEFAULT_RIPPLE,
)

response = submit_and_wait(client=client, transaction=cold_settings_transaction, wallet=cold_wallet)

print(f"AccountSet Result: {response.result['meta']['TransactionResult']}")

hot_wallet_secret = os.getenv(f"{sys.argv[2].upper()}_PRIVATE")
hot_wallet = Wallet.from_seed(hot_wallet_secret)

hot_settings_transaction = AccountSet(
    account=hot_wallet.address,
    set_flag=AccountSetAsfFlag.ASF_REQUIRE_AUTH,
)

response = submit_and_wait(client=client, transaction=hot_settings_transaction, wallet=hot_wallet)

print(f"AccountSet Result: {response.result['meta']['TransactionResult']}")


currency = sys.argv[3]

trustline_transaction = TrustSet(
    account=hot_wallet.address,
    limit_amount=IssuedCurrencyAmount(
        currency=currency,
        issuer=cold_wallet.address,
        value="1000"
    )
)

response = submit_and_wait(client=client, transaction=trustline_transaction, wallet=hot_wallet)
print(f"TrustSet Result: {response.result['meta']['TransactionResult']}")

amount = sys.argv[4]

payment_transaction = Payment(
    account=cold_wallet.address,
    destination=hot_wallet.address,
    amount=IssuedCurrencyAmount(
        currency=currency,
        issuer=cold_wallet.address,
        value=amount
    )
)

response = submit_and_wait(client=client, transaction=payment_transaction, wallet=cold_wallet)

print(f"Payment Result: {response.result['meta']['TransactionResult']}")

gateway_balances = GatewayBalances(
    account=cold_wallet.address,
    ledger_index="validated",
    hotwallet=[hot_wallet.address]
)

response = client.request(gateway_balances)

print(f"Gateway Balances: {response.result}")