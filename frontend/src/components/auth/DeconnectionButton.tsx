import React from "react";
import { useNavigate } from "react-router-dom";

const DeconnectionButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("access_token");
      console.log("User logged out");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
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
