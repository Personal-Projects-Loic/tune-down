interface ApiErrorResponse {
  detail: string;
}

interface WalletResponse {
  address: string;
  balance: string;
  sequence: number;
  ledger_index: number;
  flags: number;
  owner_count: number;
  previous_txn_id: string;
  previous_txn_lgr_seq: number;
  sufficient_balance: boolean;
}

export const addWallet = async (walletPublicKey: string): Promise<WalletResponse | null> => {
  try {
    const response = await fetch("http://localhost:8000/wallet/add_wallet", {
      method: "POST",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        wallet_id: walletPublicKey.trim(),
      }),  // Envoi du FormData au lieu d'un JSON
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();
      throw new Error(errorData.detail || "Erreur lors de l'ajout du wallet");
    }

    const data: WalletResponse = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
