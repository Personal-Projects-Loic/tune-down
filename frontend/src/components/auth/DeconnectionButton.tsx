import React from "react";
import { useNavigate } from "react-router-dom";

const DeconnectionButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_TUNEDOWN_API_URL}/auth/signout`,
        {
          method: "POST",
          credentials: "include",
          mode: "cors",
        },
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default DeconnectionButton;
