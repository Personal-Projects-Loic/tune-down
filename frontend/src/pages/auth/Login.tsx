import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import logo from "../../assets/tunedown.png";

const Login: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    const isAuthenticated = Cookies.get("is_authenticated");

    if (accessToken || isAuthenticated) {
      const handleLogout = async () => {
        console.log("Logging out...");
        try {
          const response = await fetch(
            "https://api.tunedown.fr/api/auth/signout",
            {
              method: "POST",
              credentials: "include",
              mode: "cors",
            },
          );

          if (!response.ok) {
            throw new Error("Logout failed");
          }

          console.log("Logout successful");
          navigate("/login");
        } catch (err) {
          console.error("Logout error:", err);
        }
      };

      handleLogout();
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const requestBody = JSON.stringify({
        email_or_username: emailOrUsername,
        password: password,
      });
      console.log("Request Body:", requestBody);

      const response = await fetch("https://api.tunedown.fr/api/auth/signin", {
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
        setError(errorData.detail || "Login failed");
        console.error("Login failed:", errorData.detail);
        throw new Error(errorData.detail || "Login failed");
      }

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
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email or Username:</label>
          <input
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
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
          Login
        </button>
      </form>
      <p className="auth-link">
        Don't have an account? <a href="/sign-up">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
