import React, { CSSProperties } from "react";
import headerLogo from "../assets/tuneDownLogo.png";
import "../assets/fonts/Poppins-Roboto/Poppins/Poppins-Regular.ttf";
import "./fonts.css";
import { useNavigate } from "react-router-dom";
const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header style={styles.header}>
      <img src={headerLogo} alt="Logo" style={styles.logo} onClick={() => navigate("/caca")}/>
      <text style={styles.title} onClick={() => navigate("/profil")}>Profil</text>
    </header>
  );
};

const styles: { [key: string]: CSSProperties } = {
  header: {
    padding: "10px",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: "40px",
    marginRight: "10px",
  },
  title: {
    color: "#1139b9",
    fontFamily: "Poppins, sans-serif"
  }
};

export default Header;