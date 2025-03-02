import React, { useState } from "react";
import axios from "axios";
import "./Wallet.css";

const NFTOffers: React.FC = () => {
  const [offers, setOffers] = useState<{
    status: string;
    offers: Array<{
      offer_id: string;
      nft_id: string;
      amount: number;
      destination?: string;
      expiration?: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOffers(null);

    const formData = new FormData(e.currentTarget);
    const nft_id = formData.get("nft_id") as string;

    try {
      const response = await axios.get(
        `http://tunedown.fr:8000/get-nft-offers/${nft_id}`,
      );
      setOffers(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des offres");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h1>Offres NFT</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nft_id">ID du nft :</label>
          <input
            type="text"
            id="nft_id"
            name="nft_id"
            placeholder="Entrez l'adresse publique"
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Chargement..." : "Récupérer les offres"}
        </button>
      </form>
      {offers && (
        <div className="offer-list">
          <h2>Liste des offres</h2>
          <p>Statut : {offers.status}</p>
          <ul>
            {offers.offers.map((offer) => (
              <li key={offer.offer_id}>
                <p>ID de l'offre : {offer.offer_id}</p>
                <p>ID du NFT : {offer.nft_id}</p>
                <p>Montant : {offer.amount}</p>
                {offer.destination && <p>Destination : {offer.destination}</p>}
                {offer.expiration && <p>Expiration : {offer.expiration}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default NFTOffers;
