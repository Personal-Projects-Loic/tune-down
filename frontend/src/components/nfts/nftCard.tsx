import React from "react";
import { Product } from "../../types/nft";
import { useNavigate } from "react-router-dom";
import { Box, Image, Text, BackgroundImage } from "@mantine/core";
const NFTCard: React.FC<Product> = (nft) => {
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

export const NewCard: React.FC<Product> = (nft) => {
  const navigate = useNavigate();

  return(
    <Box
    w={200}
    h={300}
    onClick={() => navigate(`/nft/${nft.id}`, { state: nft })}
    style={{
      borderRadius: "10px",
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform 0.2s ease-in-out",
    }}
  >
    <BackgroundImage src={nft.url} radius="md" h={300}  w={200}>
      <Box p="md" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "10px" }}>
        <Text color="white"  size="lg" >
          {nft.name}
        </Text>
        <Text color="white" size="md">
          {nft.price}
        </Text>
      </Box>
    </BackgroundImage>
  </Box>
      
  )
}

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

export default NFTCard;
