import { Wallet } from "../../types/wallet";

export const getWallet = async (): Promise<Wallet | null> => {
  try {
    const response = await fetch("http://localhost:8000/wallet/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données du portefeuille");
    }

    const data = await response.json();
    console.log("Données du portefeuille récupérées avec succès :", data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}