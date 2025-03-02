import { useState, useEffect } from "react";
import { Product, Nft } from "../../types/nft";
import { useLocation } from "react-router-dom";
import { Stack, Card, Tabs, Grid, Text, Button, Image, Divider, Group, Anchor } from "@mantine/core";
import { getSellOffer } from "../../api/nft/getSellOffer";
import { NftOffer } from "../../types/nftOffer";
import { getWallet } from "../../api/wallet/getWallet";
import { Wallet } from "../../types/wallet";

export default function OwnerNftPage() {
  const location = useLocation();
  const nft = location.state as Nft | undefined;
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [sellOffer, setSellOffer] = useState<NftOffer | null>(null);

  const fetchData = async () => {
    try {
      const [wallet, nftOffer] = await Promise.all([getWallet(), getSellOffer(nft?.nft_infos.id ?? "")]);
      setWalletData(wallet);
      setSellOffer(nftOffer);
      console.log("wallet Data:", wallet);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(walletData);
  }, []);

  if (!nft) {
    return <h2>No item found</h2>;
  }

  return (
    <Stack align="center">
      <Text>My nft</Text>
    </Stack>
  );
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
