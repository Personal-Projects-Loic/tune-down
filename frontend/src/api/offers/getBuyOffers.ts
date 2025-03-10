import { NftOffer } from "../../types/nftOffer";
import { notify } from "../../utils/notify";

export const getBuyOffers = async (nft_id: string): Promise<NftOffer[] | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/get_nft_buy_offer?nft_id=${nft_id}`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    })

    if (response.status === 404) {
      notify({ title: "0 offres", message: "Aucune offre d'achat trouvée pour ce NFT", type: "warning" });
      return null;
    }

    if (!response.ok) {
      throw new Error("Error retrieving buy offers");
      return null;
    }

    const data = await response.json();
    notify({ title: "Offres d'achat récupérées", message: "Offres d'achat récupérées avec succès", type: "success" });
    return data;
  } catch (err) {
    console.error(err);
    return null
  }
};