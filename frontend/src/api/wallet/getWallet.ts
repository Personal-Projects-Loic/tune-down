import { Wallet } from "../../types/wallet";
import { notify } from "../../utils/notify";

export const getWallet = async (): Promise<Wallet | null> => {
  try {
    const response = await fetch("http://localhost:8000/wallet/", {
      method: "GET",
      credentials: "include",
      mode: "cors",
    });

    if (response.status === 204) {
      console.log("Aucun portefeuille trouvé pour cet utilisateur");
      notify({ title: "Portefeuille introuvable", message: "Aucun portefeuille trouvé pour cet utilisateur", type: "warning" });
      return null
    }

    if (!response.ok) {
      notify({ title: "Erreur", message: "Erreur lors de la récupération des données du portefeuille", type: "error" });
      throw new Error("Erreur lors de la récupération des données du portefeuille");
    }

    const data = await response.json();
    console.log("Données du portefeuille récupérées avec succès :", data);
    notify({ title: "Portefeuille récupéré", message: "Données du portefeuille récupérées avec succès", type: "success" });
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}