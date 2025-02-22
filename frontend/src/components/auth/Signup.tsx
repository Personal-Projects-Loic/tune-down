import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "../../assets/tunedown.png";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const requestBody = JSON.stringify({ email, username, password });
      console.log("Request Body:", requestBody);

      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail[0].message);
        console.error("Signup failed:", errorData.detail[0].message);
        throw new Error(errorData.detail[0].message || "Signup failed");
      }

      const data = await response.json();
      console.log("Signup successful:", data);

      sessionStorage.setItem("access_token", data.access_token);

      navigate("/login");
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
      <h2>Signup</h2>
      <form className="auth-form" onSubmit={handleSignup}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">
          Signup
        </button>
      </form>
      <p className="auth-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
