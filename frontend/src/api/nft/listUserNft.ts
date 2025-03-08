import { Nft } from "../../types/nft"

export const listUserNft = async (): Promise<Nft[] | null> => {
  const page = 1;
  const limit = 10;

  try {
    const response = await fetch(`http://localhost:8000/wallet/user_nfts?page=${page}&limit=${limit}`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des NFTs de l'utilisateur");
    }

    const data = await response.json();
    console.log("NFTs de l'utilisateur récupérés avec succès :", data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}