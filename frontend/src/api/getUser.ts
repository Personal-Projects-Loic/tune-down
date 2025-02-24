import { User } from "../types/user";

export const getUserData = async (): Promise<User | null> => {
  try {
    const response = await fetch("http://localhost:8000/user/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
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