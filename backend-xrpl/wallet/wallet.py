import uuid
from xrpl.wallet import Wallet
from wallet.models import WalletResponse
from xrpl.clients import JsonRpcClient
from xrpl.models.transactions import Payment
from xrpl.utils import xrp_to_drops
from xrpl.transaction import submit_and_wait

def generate_wallet() -> WalletResponse:
    try:
        wallet = Wallet.create()
        wallet_id = str(uuid.uuid4())
        return WalletResponse(
            id=wallet_id,
            public_key=wallet.classic_address,
            private_key=wallet.seed
        )
    except Exception as e:
        print(f"Erreur lors de la génération du wallet : {e}")
        raise RuntimeError("Erreur lors de la génération du wallet")

def is_valid_xrpl_wallet(classic_address: str, seed: str) -> tuple[bool, str]:
    try:
        wallet = Wallet.from_seed(seed)
        if wallet.classic_address != classic_address:
            return False, "L'adresse publique ne correspond pas à la clé privée fournie."
        return True, "Le wallet est valide et l'adresse correspond à la clé privée."
    except Exception as e:
        return False, f"Erreur de validation du wallet: {str(e)}"

async def transfer_xrps(sender_seed: str, receiver_address: str, amount: int) -> dict:
    client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

    try:
        sender_wallet = Wallet.from_seed(sender_seed)

        payment = Payment(
            account=sender_wallet.classic_address,
            amount=xrp_to_drops(amount),
            destination=receiver_address
        )

        response = await submit_and_wait(payment, client, sender_wallet)
        return {
            "status": "success",
            "transaction_result": response.result["meta"]["TransactionResult"],
            "transaction_hash": response.result["hash"]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
