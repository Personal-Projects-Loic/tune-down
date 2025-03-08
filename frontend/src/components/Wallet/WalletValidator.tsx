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
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [noWallet, setNoWallet] = useState(false);

  const addWallet = async () => {
    if (!walletId.trim()) {
      setError("Veuillez entrer un identifiant de wallet.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/add_wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          wallet_id: walletId,
        }),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.detail || "Erreur lors de l'ajout du wallet");
      }

      const data: WalletResponse = await response.json();
      setWallet(data);
      setNoWallet(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 204) {
        console.log("No wallet found for this user yet");
        setNoWallet(true);
        setWallet(null);
        return;
      }

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la récupération du wallet",
        );
      }

      const data: WalletResponse = await response.json();
      setWallet(data);
      setNoWallet(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const deleteWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/delete_wallet`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.detail || "Erreur lors de la suppression du wallet",
        );
      }

      setWallet(null);
      setNoWallet(true);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* désole arthur, je sais que mettre cette fonction ici
  et ne pas faire de composant pour ca c'est pas très bien.
 J'espère que ce ne sera pas trop chiant à ranger ^^ */

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

      {noWallet ? (
        <div className="wallet-details">
          <h2>Pas de wallet</h2>
        </div>
      ) : (
        wallet && (
          <div className="wallet-details">
            <h2>Détails du Wallet :</h2>
            <p>
              <strong>Adresse publique :</strong> {wallet.address}
            </p>
            <p>
              <strong>Balance :</strong> {wallet.balance}
            </p>
            <button onClick={deleteWallet} disabled={loading}>
              {loading ? "Suppression en cours..." : "Supprimer le Wallet"}
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default WalletManager;
