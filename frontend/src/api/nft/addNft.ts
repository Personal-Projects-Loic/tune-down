import { Wallet } from "../../types/wallet";
import { newNFT } from "../../types/nft";
import { notify } from "../../utils/notify";

export const addNft = async (newNft: newNFT, secretKey: string): Promise<Wallet | null> => {
  try {
    // Create a FormData object
    const formData = new FormData();
    
    // Add the secret key
    formData.append("wallet_secret", secretKey.trim());
    
    // Add the NFT data
    formData.append("name", newNft.name);
    formData.append("collection", newNft.collection);
    
    // Add the image file if it exists
    if (newNft.image) {
      formData.append("file", newNft.image);
    }
    
    const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/add_nft`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      // Don't set Content-Type header, it will be automatically set with the boundary
      body: formData,
    });

    if (response.status === 406) {
      console.log("Invalid wallet seed format");
      notify({ title: "Erreur", message: "Format de clé secrète de portefeuille invalide", type: "error" });
      return null;
    }

    if (response.status === 401) {
      console.log("No wallet found for this user");
      notify({ title: "Erreur", message: "Aucun portefeuille trouvé pour cet utilisateur", type: "error" });
      return null;
    }
    
    if (response.status === 400) {
      console.log("Missing required data");
      notify({ title: "Erreur", message: "Données manquantes", type: "error" });
      return null;
    }

    if (!response.ok) {
      throw new Error("Error retrieving wallet data");
    }

    const data = await response.json();
    console.log("Wallet data successfully retrieved:", data);
    notify({ title: "NFT ajouté", message: "NFT ajouté avec succès", type: "success" });
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}