import React, { useState } from "react";
import "./Wallet.css";

const WalletCreateNFT: React.FC = () => {
  const [transactionResult, setTransactionResult] = useState<{
    status: string;
    transaction_hash?: string;
    message?: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    let nft_uri = e.currentTarget.nft_uri.value;
    let wallet_seed = e.currentTarget.wallet_seed.value;
    console.log(nft_uri, wallet_seed);
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTransactionResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/create-nft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_seed: wallet_seed,
          uri: nft_uri,
        }),
      });
      setTransactionResult(await response.json());
    } catch (err) {
      setError("Erreur lors de la transaction");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h1>Creer un NFT</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="wallet_seed">Clé privée :</label>
          <input
            type="text"
            id="wallet_seed"
            placeholder="Entrez la clé privée"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nft_uri">URI à stocker :</label>
          <input
            type="text"
            id="nft_uri"
            placeholder="Entrez l'adresse du destinataire"
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Envoi en cours..." : "Envoyer XRP"}
        </button>
      </form>
      {transactionResult && (
        <div className="transaction-result">
          <h2>Résultat de la transaction</h2>
          <p>Statut : {transactionResult.status}</p>
          {transactionResult.transaction_hash && (
            <p>Hash de la transaction : {transactionResult.transaction_hash}</p>
          )}
          {transactionResult.message && (
            <p>Message : {transactionResult.message}</p>
          )}
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default WalletCreateNFT;
