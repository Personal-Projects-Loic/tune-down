import { NftOffer } from "../../types/nftOffer";
import { notify } from "../../utils/notify";

export const getSellOffer = async (nft_id: string): Promise<NftOffer[] | null> => {
  try {
    const response = await fetch(`http://localhost:8000/wallet/get_nft_sell_offer?nft_id=${nft_id}`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 404) {
      notify({ title: "0 offres", message: "Aucune offre de vente trouvée pour ce NFT", type: "warning" });
      return null
    }

    if (!response.ok) {
      throw new Error("Error retrieving sell offer data");
    }

    const data = await response.json();
    notify({ title: "Offres de vente récupérées", message: "Offres de vente récupérées avec succès", type: "success" });
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};