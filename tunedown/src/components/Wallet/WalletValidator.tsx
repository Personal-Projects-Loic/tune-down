import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import {
  auth,
  db,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "../../firebase";
import { hashPrivateKey } from "../../utils/hashUtil";
import "./Wallet.css";

interface ApiErrorResponse {
  detail: string;
}

interface WalletResponse {
  id: string;
  private_key: string;
  public_key: string;
}

interface ValidationResult {
  is_valid: boolean;
  message: string;
}

const fetchUserWallet = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Aucun utilisateur connecté.");
    return null;
  }

  try {
    const walletsRef = collection(db, "wallets");
    const q = query(walletsRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const walletsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WalletResponse[];
      return walletsData;
    } else {
      console.log("Aucun wallet trouvé pour cet utilisateur.");
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du wallet :", error);
    return null;
  }
};

//const getXrplAccountInfo = async (classicAddress: string) => {
//  try {
//    const response = await axios.get<ValidationResult>(
//      `http://localhost:8000/account-info/${classicAddress.trim()}`
//    );
//
//    console.log("Informations du compte XRPL :", response.data);
//  } catch (err) {
//    console.error("Erreur lors de la récupération des informations du compte :", err);
//    return null;
//  }
//}

const WalletValidator: React.FC = () => {
  const [classicAddress, setClassicAddress] = useState("");
  const [seed, setSeed] = useState("");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userWallets, setUserWallets] = useState<WalletResponse[]>([]);

  useEffect(() => {
    const fetchWallets = async () => {
      const walletData = await fetchUserWallet();
      console.log("prouttttt");
      if (walletData) {
        setUserWallets(walletData);
       // getXrplAccountInfo(walletData[0].public_key);
      }
    };

    fetchWallets();
  }, []);

  const validateWallet = async () => {
    if (!classicAddress.trim() || !seed.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError(null);
    setValidationResult(null);

    try {
      const response = await axios.post<ValidationResult>(
        "http://localhost:8000/validate-wallet",
        {
          classic_address: classicAddress.trim(),
          seed: seed.trim(),
        },
      );

      setValidationResult(response.data);

      if (response.data.is_valid) {
        const user = auth.currentUser;
        if (!user) {
          console.error("Aucun utilisateur connecté.");
          return;
        }

        const hashedPrivateKey = await hashPrivateKey(seed.trim());

        try {
          const docRef = await addDoc(collection(db, "wallets"), {
            private_key: hashedPrivateKey,
            public_key: classicAddress.trim(),
            timestamp: new Date(),
            userId: user.uid,
          });

          console.log("Wallet enregistré dans Firebase !");

          setUserWallets([
            ...userWallets,
            {
              id: docRef.id,
              private_key: hashedPrivateKey,
              public_key: classicAddress.trim(),
            },
          ]);
        } catch (error) {
          console.error(
            "Erreur lors de l'enregistrement dans Firebase :",
            error,
          );
        }
      }
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      let errorMessage = "Erreur lors de la validation du wallet";
      if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteWallet = async (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("Aucun utilisateur connecté.");
      return;
    }

    try {
      await deleteDoc(doc(db, "wallets", id));
      console.log("Wallet supprimé de Firebase !");
      setUserWallets(userWallets.filter((wallet) => wallet.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du wallet :", error);
    }
  };

  return (
    <div className="component-container">
      <h1>Validateur de Wallet XRPL</h1>
      <div className="form-group">
        <label>
          Adresse publique (Classic Address) :
          <input
            type="text"
            value={classicAddress}
            onChange={(e) => setClassicAddress(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Clé privée (Seed) :
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </label>
      </div>
      <button
        className="auth-button"
        onClick={validateWallet}
        disabled={loading}
      >
        {loading ? "Validation en cours..." : "Valider le Wallet"}
      </button>
      {error && <div className="error-message">{error}</div>}
      {validationResult && (
        <div
          className={`validation-message ${validationResult.is_valid ? "success" : "error"}`}
        >
          <h2>
            {validationResult.is_valid ? "Wallet valide" : "Wallet invalide"}
          </h2>
          <p>{validationResult.message}</p>
        </div>
      )}
      {userWallets.length > 0 && (
        <div className="user-wallets">
          <h2>Vos Wallets :</h2>
          {userWallets.map((wallet, index) => (
            <div key={index} className="wallet-item">
              <p>
                <strong>Adresse publique :</strong> {wallet.public_key}
              </p>
              <p>
                <strong>Clé privée (Seed) :</strong> {"sXXXXXXXXXXXXX"}
              </p>
              <button
                className="delete-button"
                onClick={() => deleteWallet(wallet.id)}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletValidator;
