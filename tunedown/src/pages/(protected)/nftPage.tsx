import React from "react";
import { Product } from "../../types/nft";
import { useLocation } from "react-router-dom";
import Layout from "./layout";

export default function TestNftPage() {
  
  const location = useLocation();
  const nft = location.state as Product;

  if (!nft) {
    return <h2>No item found</h2>;
  }

  return (
    <Layout>
      <div style={styles.card} onClick={() => console.log(nft.name)}>
        <img src={nft.url} alt={nft.name} style={styles.image} />
        <div style={styles.overlay}>
          <h2 style={styles.text}>{nft.name}</h2>
          <p style={styles.text}>{nft.price}</p>
        </div>
      </div>
    </Layout>

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
