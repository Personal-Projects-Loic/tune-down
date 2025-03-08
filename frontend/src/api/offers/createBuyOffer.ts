import { NftOffer, buyOffer } from "../../types/nftOffer";
import { notify } from "../../utils/notify";

export const createBuyOffer = async (newOffer: buyOffer): Promise<NftOffer | null> => {
  try {
    const response = await fetch("http://localhost:8000/wallet/create_nft_buy_offer", {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOffer),
    })

    if (!response.ok) {
      notify({ title: "Erreur", message: "Erreur lors de la création de l'offre d'achat", type: "error" });
      throw new Error("Error creating buy offer");
      return null;
    }

    const data = await response.json();
    console.log("Buy offer successfully created:", data);
    notify({ title: "Offre d'achat créée", message: "Offre d'achat créée avec succès", type: "success" });
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};