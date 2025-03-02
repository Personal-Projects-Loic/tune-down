import React, { useState } from "react";
import "../Wallet/Wallet.css";

interface ApiErrorResponse {
  detail: string;
}

interface WalletResponse {
  balance: string;
}

const Wallet: React.FC = () => {
  const [classicAddress, setClassicAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);

  const handleGetBalance = async () => {
    if (!classicAddress) {
      setError("Veuillez entrer une adresse publique.");
      return;
    }

    setLoading(true);
    setError(null);
    setWalletBalance(null);

    try {
      const response = await fetch(
        `http://159.69.154.76:8000/wallet/?wallet_id=${classicAddress.trim()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (response.status === 204) {
        setError("Aucun portefeuille trouvé pour cette adresse.");
        return;
      }

      if (response.status === 500) {
        setError("Erreur lors de la récupération du solde");
        return;
      }

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la récupération du solde",
        );
      }

      const data: WalletResponse = await response.json();
      setWalletBalance(data.balance);
      console.log("Solde récupéré avec succès :", data.balance);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h1>Get Account Balance</h1>
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
      <button
        className="auth-button"
        onClick={handleGetBalance}
        disabled={loading}
      >
        {loading ? "Validation en cours..." : "Get Balance"}
      </button>
      {error && <div className="error-message">{error}</div>}
      {walletBalance && (
        <div>
          <h2>Balance</h2>
          <p>{walletBalance}</p>
        </div>
      )}
    </div>
  );
};

export default Wallet;
