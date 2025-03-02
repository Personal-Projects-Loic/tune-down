import React, { useState } from "react";
import axios from "axios";
import "./Wallet.css";

const NFTSellOfferRequest: React.FC = () => {
  const [response, setResponse] = useState<{
    status: string;
    transaction_hash: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData(e.currentTarget);
    const walletSeed = formData.get("wallet_seed") as string;
    const nftId = formData.get("nft_id") as string;
    const amount = Number(formData.get("amount"));
    const destination = formData.get("destination") as string | null;
    const expiration = formData.get("expiration")
      ? Number(formData.get("expiration"))
      : null;

    try {
      const response = await axios.post(
        "http://159.69.154.76:8000/create-nft-sell-offer",
        {
          wallet_seed: walletSeed,
          nft_id: nftId,
          amount: amount,
          destination: destination || undefined,
          expiration: expiration || undefined,
        },
      );
      setResponse(response.data);
    } catch (err) {
      setError("Erreur lors de la création de l'offre de vente");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h1>Créer une offre de vente NFT</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="wallet_seed">Clé privée :</label>
          <input
            type="text"
            id="wallet_seed"
            name="wallet_seed"
            placeholder="Entrez la clé privée"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nft_id">ID du NFT :</label>
          <input
            type="text"
            id="nft_id"
            name="nft_id"
            placeholder="Entrez l'ID du NFT"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Montant :</label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="Entrez le montant"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="destination">Destination (optionnel) :</label>
          <input
            type="text"
            id="destination"
            name="destination"
            placeholder="Entrez la destination"
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiration">Expiration (optionnel) :</label>
          <input
            type="number"
            id="expiration"
            name="expiration"
            placeholder="Entrez l'expiration"
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Création en cours..." : "Créer l'offre"}
        </button>
      </form>
      {response && (
        <div className="transaction-result">
          <h2>Résultat de la transaction</h2>
          <p>Statut : {response.status}</p>
          <p>Hash de la transaction : {response.transaction_hash}</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default NFTSellOfferRequest;
