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
import useWalletStore from "../../utils/store";
import { listUserNft } from "../../api/nft/listUserNft";
import NftGrid from "../../components/profil/nftGrid";
import WalletCard from "../../components/profil/walletCard";

export default function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [createWalletClicked, setCreateWalletClicked] = useState<boolean>(false);
  const [walletPublicKey, setWalletPublicKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nftList, setNftList] = useState<Nft[] | null>(null);
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

  const fetchNftList = async () => {
    const nfts = await listUserNft();
    console.log("NFTs:", nfts);
    if (nfts != null) {
      setNftList(nfts);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchNftList();
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