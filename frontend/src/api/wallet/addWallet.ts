import { Wallet } from "../../types/wallet";

interface ApiErrorResponse {
  detail: string;
}

export const addWallet = async (walletPublicKey: string): Promise<Wallet | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/add_wallet`, {
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

    const data: Wallet = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
