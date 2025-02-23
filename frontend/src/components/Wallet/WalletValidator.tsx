import React, { useState, useEffect } from "react";
import "./Wallet.css";

interface ApiErrorResponse {
  detail: string;
}

interface WalletResponse {
  address: string;
  balance: string;
  sequence: number;
  ledger_index: number;
  flags: number;
  owner_count: number;
  previous_txn_id: string;
  previous_txn_lgr_seq: number;
  sufficient_balance: boolean;
}

const WalletManager: React.FC = () => {
  const [walletId, setWalletId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletResponse | null>(null);
  const [storedWallet, setStoredWallet] = useState<WalletResponse | null>(null);

  const addWallet = async () => {
    if (!walletId.trim()) {
      setError("Veuillez entrer un identifiant de wallet.");
      return;
    }

    setLoading(true);
    setError(null);
    setWalletData(null);

    try {
      const response = await fetch("http://localhost:8000/wallet/add_wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          wallet_id: walletId.trim(),
        }),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.detail || "Erreur lors de l'ajout du wallet");
      }

      const data: WalletResponse = await response.json();
      setWalletData(data);
      console.log("Wallet ajouté avec succès :", data);

      await fetchWallet();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await fetch("http://localhost:8000/wallet/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la récupération du wallet",
        );
      }

      const data: WalletResponse = await response.json();
      setStoredWallet(data);
      console.log("Wallet récupéré avec succès :", data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="component-container">
      <h1>Gestionnaire de Wallets XRPL</h1>
      <div className="form-group">
        <label>
          Identifiant du Wallet (Adresse publique) :
          <input
            type="text"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
          />
        </label>
      </div>
      <button className="auth-button" onClick={addWallet} disabled={loading}>
        {loading ? "Ajout en cours..." : "Ajouter le Wallet"}
      </button>
      {error && <div className="error-message">{error}</div>}

      {walletData && (
        <div className="wallet-details">
          <h2>Détails du Wallet ajouté :</h2>
          <p>
            <strong>Adresse publique :</strong> {walletData.address}
          </p>
          <p>
            <strong>Balance :</strong> {walletData.balance}
          </p>
        </div>
      )}

      {storedWallet && (
        <div className="wallet-details">
          <h2>Détails du Wallet stocké :</h2>
          <p>
            <strong>Adresse publique :</strong> {storedWallet.address}
          </p>
          <p>
            <strong>Balance :</strong> {storedWallet.balance}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletManager;
