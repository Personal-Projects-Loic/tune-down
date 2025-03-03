import { Wallet } from "../../types/wallet";
import { newNFT } from "../../types/nft";

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
    
    const response = await fetch("http://localhost:8000/wallet/add_nft", {
      method: "POST",
      credentials: "include",
      mode: "cors",
      // Don't set Content-Type header, it will be automatically set with the boundary
      body: formData,
    });

    if (response.status === 406) {
      console.log("Invalid wallet seed format");
      return null;
    }

    if (response.status === 401) {
      console.log("No wallet found for this user");
      return null;
    }
    
    if (response.status === 400) {
      console.log("Missing required data");
      return null;
    }

    if (!response.ok) {
      throw new Error("Error retrieving wallet data");
    }

    const data = await response.json();
    console.log("Wallet data successfully retrieved:", data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}