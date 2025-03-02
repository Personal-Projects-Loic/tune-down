import React, { useState } from "react";
import axios from "axios";
import "./Wallet.css";

const WalletGenerator: React.FC = () => {
  const [wallet, setWallet] = useState<{
    public_key: string;
    private_key: string;
    classic_address: string;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://159.69.154.76:8000/generate-wallet",
      );
      setWallet(response.data);
    } catch (err) {
      setError("Erreur lors de la génération du wallet");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h1>Générateur de Wallet XRPL</h1>
      <button
        className="auth-button"
        onClick={generateWallet}
        disabled={loading}
      >
        {loading ? "Génération en cours..." : "Générer un Wallet"}
      </button>
      {wallet && (
        <div>
          <h2>Wallet généré</h2>
          <p>Clé publique : {wallet.public_key}</p>
          <p>Clé privée : {wallet.private_key}</p>
          <p>Adresse classique : {wallet.classic_address}</p>
          <p>Adresse : {wallet.address}</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default WalletGenerator;
