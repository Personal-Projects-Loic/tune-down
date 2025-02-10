import { auth, db, collection, query, where, getDocs } from "../firebase";

const fetchUserWallet = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Aucun utilisateur connecté.");
    return;
  }

  try {
    const walletsRef = collection(db, "wallets");
    const q = query(walletsRef, where("userId", "==", user.uid));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const walletData = querySnapshot.docs[0].data();
      console.log("Wallet de l'utilisateur :", walletData);

      return walletData;
    } else {
      console.log("Aucun wallet trouvé pour cet utilisateur.");
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du wallet :", error);
    return null;
  }
};

export default fetchUserWallet;
