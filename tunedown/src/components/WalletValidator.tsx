import React, { useState } from "react";
import axios, { AxiosError } from "axios";

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
    // Basic frontend validation
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
        errorMessage = JSON.stringify(
          error.response.data,
        ); /* uhhhhhhhhhhhhhhh erreur a cause de ce truc de con : JSON.stringify 😭 */
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Validateur de Wallet XRPL</h1>

      <div>
        <div>
          <label>
            Adresse publique (Classic Address) :
            <input
              type="text"
              value={classicAddress}
              onChange={(e) => setClassicAddress(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Clé privée (Seed) :
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

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {validationResult && (
          <div
            className={`p-3 rounded ${
              validationResult.is_valid
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            <h2 className="font-bold">
              {validationResult.is_valid ? "Wallet valide" : "Wallet invalide"}
            </h2>
            <p>{validationResult.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletValidator;
