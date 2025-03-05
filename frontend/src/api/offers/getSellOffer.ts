import { NftOffer } from "../../types/nftOffer";

export const getSellOffer = async (nft_id: string): Promise<NftOffer[] | null> => {
  try {
    const response = await fetch(`http://localhost:8000/wallet/get_nft_sell_offer?nft_id=${nft_id}`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 404) {
      console.log("No sell offer found for this NFT");
      console.log(response)
      return null
    }

    if (!response.ok) {
      throw new Error("Error retrieving sell offer data");
    }

    const data = await response.json();
    console.log("Sell offer data successfully retrieved:", data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};