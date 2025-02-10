import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import "./Wallet.css";

interface ApiErrorResponse {
  detail: string;
}

interface ValidationResult {
  is_valid: boolean;
  message: string;
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
      )}
    </div>
  );
};

export default WalletValidator;
