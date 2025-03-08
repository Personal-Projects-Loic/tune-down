import { NftOffer as nftOffer, newNftOffer } from "../../types/nftOffer";
import { notify } from "../../utils/notify";

export const createSellOffer = async (newOffer: newNftOffer): Promise<nftOffer | null> => {
  console.log("newOffer :", newOffer);
  try {
    const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/create_nft_sell_offer`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOffer),
    });

    if (!response.ok) {
      notify({ title: "Erreur", message: "Erreur lors de la création de l'offre de vente", type: "error" });
      throw new Error("Error creating sell offer");
    }

    const data = await response.json();
    notify({ title: "Offre de vente créée", message: "Offre de vente créée avec succès", type: "success" });
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}