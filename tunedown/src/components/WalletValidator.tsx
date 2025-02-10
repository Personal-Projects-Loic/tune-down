import React, { useState } from "react";
import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  detail: string;
}

const WalletValidator: React.FC = () => {
  const [classicAddress, setClassicAddress] = useState("");
  const [seed, setSeed] = useState("");
  const [validationResult, setValidationResult] = useState<{
    is_valid: boolean;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:8000/validate-wallet",
        {
          classic_address: classicAddress,
          seed: seed,
        },
      );
      setValidationResult(response.data);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      setError(
        error.response?.data?.detail ||
          "Erreur lors de la validation du wallet",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Validateur de Wallet XRPL</h1>
      <div>
        <label>
          Adresse publique :
          <input
            type="text"
            value={classicAddress}
            onChange={(e) => setClassicAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Clé privée :
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
          />
        </label>
      </div>
      <button onClick={validateWallet} disabled={loading}>
        {loading ? "Validation en cours..." : "Valider le Wallet"}
      </button>
      {validationResult && (
        <div>
          <h2>
            {validationResult.is_valid ? "Wallet valide" : "Wallet invalide"}
          </h2>
          <p>{validationResult.message}</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default WalletValidator;
