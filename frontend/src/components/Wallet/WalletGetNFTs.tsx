import React, { useState } from "react";
import axios from "axios";
import "./Wallet.css";

const WalletGetNfts: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [nfts, setNfts] = useState<{
    status: string;
    nfts: Array<{
      id: string;
      uri: string;
      flags: number;
      taxon: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNfts(null);

    try {
      const response = await axios.get(
        `https://api.tunedown.fr/api/get-nfts/${address}`,
      );
      setNfts(response.data);
    } catch (err) {
      setError("Erreur lors de la récupération des NFTs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h1>Récupérer les NFTs</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="address">Adresse :</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Entrez l'adresse"
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Chargement..." : "Récupérer les NFTs"}
        </button>
      </form>
      {nfts && (
        <div className="nft-list">
          <h2>Liste des NFTs</h2>
          <p>Statut : {nfts.status}</p>
          <ul>
            {nfts.nfts.map((nft) => (
              <li key={nft.id}>
                <p>id : {nft.id}</p>
                <p>URI : {nft.uri}</p>
                <p>Flags : {nft.flags}</p>
                <p>Taxon : {nft.taxon}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default WalletGetNfts;
