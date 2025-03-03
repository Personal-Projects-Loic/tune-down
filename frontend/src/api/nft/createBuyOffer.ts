import { NftOffer, buyOffer } from "../../types/nftOffer";

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
      throw new Error("Error creating buy offer");
      return null;
    }

    const data = await response.json();
    console.log("Buy offer successfully created:", data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};