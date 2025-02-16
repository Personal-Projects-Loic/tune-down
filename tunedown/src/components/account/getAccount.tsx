import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import "../Wallet/Wallet.css";

interface ApiErrorResponse {
  detail: string;
}

const GetAccount: React.FC = () => {
  const [classicAddress, setClassicAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<any | null>(null);
  const onGetAccount = async () => {
    if (!classicAddress) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:8000/account-info/${classicAddress.trim()}`,
      );
      console.log(response.data);
      setAccount(response.data);
    } catch (err) {
      const errorResponse = err as AxiosError<ApiErrorResponse>;
      setError(
        errorResponse.response?.data.detail ||
          "Erreur lors de la récupération du compte",
      );
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
          Clé publique (Classic Address) :
          <input
            type="text"
            value={classicAddress}
            onChange={(e) => setClassicAddress(e.target.value)}
          />
        </label>
      </div>
      <button className="auth-button" onClick={onGetAccount} disabled={loading}>
        {loading ? "Validation en cours..." : "get account"}
      </button>
      {error && <div className="error-message">{error}</div>}
      {account && (
        <div>
          <h2>Account</h2>
          <p>Balance : {account.balance}</p>
        </div>
      )}
    </div>
  );
};

export default GetAccount;
