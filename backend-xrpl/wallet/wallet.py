from xrpl.wallet import Wallet

def generate_wallet():
    try:
        wallet = Wallet.create()
        return {"public_key": wallet.classic_address, "private_key": wallet.seed}
    except Exception as e:
        print(f"Erreur lors de la génération du wallet : {e}")
        return {"error": "Erreur lors de la génération du wallet"}

def is_valid_xrpl_wallet(classic_address: str, seed: str) -> tuple[bool, str]:
    try:
        wallet = Wallet.from_seed(seed)
        if wallet.classic_address != classic_address:
            return False, "L'adresse publique ne correspond pas à la clé privée fournie."
        return True, "Le wallet est valide et l'adresse correspond à la clé privée."
    except Exception as e:
        return False, f"Erreur de validation du wallet: {str(e)}"
