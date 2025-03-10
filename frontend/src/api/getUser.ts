import { User } from "../types/user";

export const getUserData = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/user/`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données utilisateur");
    }

    const data = await response.json();
    console.log("Données utilisateur récupérées avec succès :", data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}