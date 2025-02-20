import React from "react";
import { Product } from "../../types/nft";
import { useNavigate } from "react-router-dom";

const Card: React.FC<Product> = (nft) => {
  const navigate = useNavigate();
  return (
    <div style={styles.card} onClick={() => navigate(`/nft/${nft.id}`, { state: nft })}>
      <img src={nft.url} alt={nft.name} style={styles.image} />
      <div style={styles.overlay}>
        <h2 style={styles.text}>{nft.name}</h2>
        <p style={styles.text}>{nft.price}</p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    position: "relative" as "relative",
    width: "200px",
    height: "300px",
    overflow: "hidden" as "hidden",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as "cover",
  },
  overlay: {
    position: "absolute" as "absolute",
    bottom: "0",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    width: "100%",
    padding: "10px",
    textAlign: "center" as "center",
  },
  text: {
    margin: "5px 0",
  },
};

export default Card;
