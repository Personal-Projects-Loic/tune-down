import { Nft } from "../../types/nft";

export const listNft = async (): Promise<Nft[] | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/list`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        limit: 10,
      }),  // Envoi du FormData au lieu d'un JSON
    });

    if (response.status === 204) {
      console.log("No NFT found for this user");
      return null
    }

    if (!response.ok) {
      throw new Error("Error retrieving NFT data");
    }

    const data = await response.json();
    console.log("NFT data successfully retrieved:", data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}