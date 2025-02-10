import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { auth, db, collection, addDoc } from "../../firebase";
import "./Wallet.css";

interface ApiErrorResponse {
  detail: string;
}

interface WalletResponse {
  private_key: string;
  public_key: string;
}

interface ValidationResult {
  is_valid: boolean;
  message: string;
  new_wallet?: WalletResponse;
}

const WalletValidator: React.FC = () => {
  const [classicAddress, setClassicAddress] = useState("");
  const [seed, setSeed] = useState("");
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (response.data.is_valid && response.data.new_wallet) {
        const { private_key, public_key } = response.data.new_wallet;

        if (!private_key?.trim() || !public_key?.trim()) {
          console.error(
            "Données manquantes : private_key ou public_key est vide.",
          );
          return;
        }

        const user = auth.currentUser;
        if (!user) {
          console.error("Aucun utilisateur connecté.");
          return;
        }

        try {
          await addDoc(collection(db, "wallets"), {
            private_key,
            public_key,
            timestamp: new Date(),
            userId: user.uid,
          });

          console.log("Wallet enregistré dans Firebase !");
        } catch (error) {
          console.error(
            "Erreur lors de l'enregistrement dans Firebase :",
            error,
          );
        }
      } else {
        console.error("Réponse de l'API invalide : new_wallet manquant.");
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
          className={`validation-message ${
            validationResult.is_valid ? "success" : "error"
          }`}
        >
          <h2>
            {validationResult.is_valid ? "Wallet valide" : "Wallet invalide"}
          </h2>
          <p>{validationResult.message}</p>
        </div>
      )}{" "}
      {validationResult?.is_valid && validationResult.new_wallet && (
        <div className="new-wallet-box">
          <h3>Nouveau wallet généré :</h3>
          <p>
            <strong>Adresse publique :</strong>{" "}
            {validationResult.new_wallet.public_key}
          </p>
          <p>
            <strong>Clé privée (Seed) :</strong>{" "}
            {validationResult.new_wallet.private_key}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletValidator;
