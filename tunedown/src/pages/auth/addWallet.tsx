import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "../../assets/tunedown.png";

const AddWallet: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      //await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="tunedown" className="auth-logo" />
      <h2>Ajouter un wallet</h2>
      <text className="auth-text">
        Si vous avez déjà un wallet sur xrp veuillez entrer votre clé publique et privée
      </text>
      <form className="auth-form" onSubmit={handleSignup}>
        <div className="form-group">
          <label>Clé publique :</label>
          <input
            type="email"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Clé privée :</label>
          <input
            type="email"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">
          Associer le wallet
        </button>
      </form>
      <p className="auth-link">
        <a href="/create-wallet">Créer un wallet</a>
      </p>
    </div>
  );
};

export default AddWallet;
