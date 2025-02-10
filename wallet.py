#!/usr/bin/env python3

#
# Creation d'un wallet + display de la balance
# Le compte pour etre "utilisé" doit contenir au moins 1 XRP pour fonctionner
# Ce code verifie si le wallet existe et s'il est activé (via l'objet wallet : wallet.adress et .seed)
# wallet.adress = rXXXXXXXXXXXXXX -> clé public
# wallet.seed = sXXXXXXXXXXXXXX -> clé privée
# Faucet est l'api de test (si j'ai bien compris) de XRPL, un faux virement a ete effectué
# LE PROBLEME : Je recrée un wallet à chaque fois, (ce qui est con) donc voir comment stocker tout ça
# Envoie de XRPL fonctionnel
#

from xrpl.wallet import Wallet
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountInfo
from xrpl.models.transactions import Payment
from xrpl.transaction import submit_and_wait
from xrpl.utils import xrp_to_drops
import xrpl
import requests

testnet_url = "https://s.altnet.rippletest.net:51234/"
faucet_url = "https://faucet.altnet.rippletest.net/accounts"

test_wallet_public = "r3sji8Cej8xcrQrw68edKcEPB4iUpNG6pA" # que du test, pas vrai wallet
test_wallet_private = "sEdTmxocXSjSorPhChHWW9gNBJqP1qg"
destination_adress = "rsxZ9aVRTVk9eT1v2xnv6gsVzmDxoy4bLn" # que des fakes (pour tester générer 2 "faux" wallets)
# fake balance = 100
# sequence number = 4555442

def wallet_creation():
    wallet = Wallet.create()
    print(f"Adresse XRP : {wallet.classic_address}")
    print(f"Clé privée : {wallet.seed}")
    return wallet

def fund_wallet_with_faucet(address):
    payload = {"destination": address}
    response = requests.post(faucet_url, json=payload)

    if response.status_code == 200:
        print(f"Compte {address} financé avec succès via le faucet.")
        return True
    else:
        print(f"Erreur lors du financement du compte : {response.text}")
        return False

def send_xrpl(amount, destination, sender_seed):
    client = JsonRpcClient(testnet_url)
    sending_wallet = Wallet.from_seed(sender_seed)

    payment = Payment(
        account=sending_wallet.classic_address,
        amount=xrp_to_drops(amount),  # Conversion du montant (1 XRP = 1 000 000)       # fonction recupérée dans le github de tuto
        destination=destination,
    )
    try:
        response = submit_and_wait(payment, client, sending_wallet)
        print("Transaction réussie :", response)
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        response = f"Échec de la transaction : {e}"
        print(response)
    return response

def display_balance(wallet):
    client = JsonRpcClient(testnet_url)
    account_info = AccountInfo(
        # account=wallet.classic_address,
        account=test_wallet_public,
        ledger_index="validated"
    )
    response = client.request(account_info)

    if 'account_data' in response.result:
        print("Solde du compte:", response.result['account_data']['Balance'])
    else:
        print("Le compte n'existe pas ou n'a pas encore été activé.")
        # if fund_wallet_with_faucet(wallet.classic_address):
        if fund_wallet_with_faucet(test_wallet_public):
            response = client.request(account_info)
            if 'account_data' in response.result:
                print("Solde du compte:", response.result['account_data']['Balance'])
            else:
                print("Le compte n'a pas pu être activé.")
        else:
            print("Échec de l'activation du compte via le faucet.")

def main():
    # wallet = "prout"
    # # wallet = wallet_creation()
    # send_xrpl(amount=10, destination=destination_adress, sender_seed=test_wallet_private)
    # display_balance(wallet)
    wallet_creation()

if __name__ == "__main__":
    main()
