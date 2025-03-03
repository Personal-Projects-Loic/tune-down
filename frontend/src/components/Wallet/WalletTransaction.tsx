import React, { useState } from "react";
import axios from "axios";
import "./Wallet.css";

const WalletTransaction: React.FC = () => {
  const [senderSeed, setSenderSeed] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [transactionResult, setTransactionResult] = useState<{
    status: string;
    transaction_hash?: string;
    message?: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTransactionResult(null);

    try {
      const response = await axios.post(
        "https://api.tunedown.fr/api/transfer-xrps",
        {
          sender_seed: senderSeed,
          receiver_address: receiverAddress,
          amount: amount,
        },
      );
      setTransactionResult(response.data);
    } catch (err) {
      setError("Erreur lors de la transaction");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h1>Effectuer une transaction XRP</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="senderSeed">Clé privée de l'expéditeur :</label>
          <input
            type="text"
            id="senderSeed"
            value={senderSeed}
            onChange={(e) => setSenderSeed(e.target.value)}
            placeholder="Entrez la clé privée"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="receiverAddress">Adresse du destinataire :</label>
          <input
            type="text"
            id="receiverAddress"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="Entrez l'adresse du destinataire"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Montant (en XRP) :</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Entrez le montant"
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

export default WalletTransaction;
