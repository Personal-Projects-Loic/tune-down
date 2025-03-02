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
  Button,
  TextInput
} from "@mantine/core";
import { addWallet } from "../../api/wallet/addWallet";
import { NftCard } from "../../components/nfts/nftCard";
import { Nft } from "../../types/nft";
import pikapute from "../../assets/pikapute.png";
import useWalletStore from "../../utils/store";

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
    console.log("wallet:", wallet);
    fetchData();
  }, []);

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
      <Card shadow="xs" withBorder>
      {wallet ? (
        <Flex align="center">
          <Box flex={1}>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Text key="address">Address : {wallet?.address ?? "Non renseigné"}</Text>
              <Text key="balance">Balance : {wallet?.balance ?? "Non renseigné"}</Text>
            </SimpleGrid>
          </Box>
        </Flex>
      ) : (
        <Flex justify="center" align="center" style={{ height: "100px" }}>
          <Stack align="center">
            {createWalletClicked ? (
                <>
                <TextInput
                  label="Clé publique"
                  placeholder="Clé publique"
                  required
                  value={walletPublicKey}
                  onChange={(e) => setWalletPublicKey(e.currentTarget.value)}
                />
                <Button
                  variant="light"
                  loading={isLoading}
                  onClick={handleAddWallet}
                  disabled={!walletPublicKey}
                >
                  {"Ajouter le Wallet"}
                </Button>
                </>
            ) :
              (
                <>
                  <Text>Vous n'avez pas de wallet Connecté</Text>
                  <Button variant="light"
                    onClick={() => {
                      window.open('https://xrpl.org/resources/dev-tools/xrp-faucets', '_blank', 'noopener,noreferrer')
                      setCreateWalletClicked(true)
                    }}
                  >Ajouter un wallet</Button>
                </>
              )
            }
          </Stack>
        </Flex>
      )}
    </Card>
    {wallet ? (
      <>
        <Title order={3}>Mes Nft</Title>
        <SimpleGrid cols={6} spacing="xl">
          {nftList.map((nft, index) => (
              <NftCard
                key={index}
                nft_infos={nft.nft_infos}
                price={nft.price}
                user={nft.user}
              />
          ))}
        </SimpleGrid>
      </>
    ) : (
      <Text></Text>
    )}
    </Stack>
  );
}