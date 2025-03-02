import { useState, useEffect } from "react";
import { getUserData } from "../../api/getUser";
import { User } from "../../types/user";
import { 
  Stack,
  Title,
  Card,
  Flex,
  Avatar,
  Box,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { addWallet } from "../../api/wallet/addWallet";
import { Nft } from "../../types/nft";
import pikapute from "../../assets/pikapute.png";
import useWalletStore from "../../utils/store";
import { listUserNft } from "../../api/nft/listUserNft";
import NftGrid from "../../components/profil/nftGrid";
import WalletCard from "../../components/profil/walletCard";

const generateNfts = (length: number): Nft[] => {
  return Array.from({ length }, (_, i) => ({
    nft_infos: {
      id: `nft_${i + 1}`,
      issuer: `creator_${i + 1}`,
      owner: `proprio_${i + 1}`,
      uri: pikapute,
      flags: Math.floor(Math.random() * 10),
      transfer_fee: Math.floor(Math.random() * 100),
      taxon: Math.floor(Math.random() * 1000),
    },
    price: Math.random() > 0.5 ? parseFloat((Math.random() * 1000).toFixed(2)) : null,
    user: {
      username: `me Mario`,
    },
  }));
};

export default function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [createWalletClicked, setCreateWalletClicked] = useState<boolean>(false);
  const [walletPublicKey, setWalletPublicKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const nftList = generateNfts(10);
  const { wallet, fetchWallet } = useWalletStore();

  const fetchData = async () => {
    try {
      const user = await getUserData();
      setUserData(user);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (wallet) {
      listUserNft().then((nfts) => {
        if (nfts) {
          console.log("NFTs de l'utilisateur récupérés avec succès :", nfts);
        }
      });
    }
  }, [wallet]);
  
  const handleAddWallet = async () => {
    if (!walletPublicKey) return;
    
    setIsLoading(true);
    try {
      const result = await addWallet(walletPublicKey);
      if (result) {
        fetchWallet();
        setCreateWalletClicked(false);
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack gap="xl">
      <Title order={1}>Profil</Title>
      <Card shadow="xs" withBorder>
        <Flex align="center">
          <Stack w={200} align="center">
            <Avatar size={100}>P</Avatar>
          </Stack>
          <Box flex={1}>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Text key="email">Mail : {userData?.email ?? "Non renseigné"}</Text>
              <Text key="username">Pseudo : {userData?.username ?? "Non renseigné"}</Text>
            </SimpleGrid>
          </Box>
        </Flex>
      </Card>
      <Title order={3}>Infos wallet</Title>
      <WalletCard
        wallet={wallet}
        createWalletClicked={createWalletClicked}
        walletPublicKey={walletPublicKey}
        setWalletPublicKey={setWalletPublicKey}
        isLoading={isLoading}
        handleAddWallet={handleAddWallet}
        setCreateWalletClicked={setCreateWalletClicked}
      />
      <NftGrid wallet={wallet} nftList={nftList} />
    </Stack>
  );
}