import { NftOffer } from "../../types/nftOffer";

export const getBuyOffers = async (nft_id: string): Promise<NftOffer[] | null> => {
  try {
    const response = await fetch(`http://localhost:8000/wallet/get_nft_buy_offer?nft_id=${nft_id}`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    })

    if (response.status === 404) {
      console.log("No buy offers found for this NFT");
      console.log(response.json());
      return null;
    }

    if (!response.ok) {
      throw new Error("Error retrieving buy offers");
      return null;
    }

    const data = await response.json();
    console.log("Buy offers successfully retrieved:", data);
    return data;
  } catch (err) {
    console.error(err);
    return null
  }
};