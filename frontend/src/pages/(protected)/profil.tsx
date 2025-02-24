import { useState, useEffect } from "react";
import { getUserData } from "../../api/getUser";
import { getWallet } from "../../api/wallet/getWallet";
import { User } from "../../types/user";
import { Wallet } from "../../types/wallet";
import { Stack, Title, Card, Flex, Avatar, Box, SimpleGrid, Text, Button } from "@mantine/core";

export default function Profil() {
  const [userData, setUserData] = useState<User | null>(null);
  const [wallet, setWalletData] = useState<Wallet | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, walletData] = await Promise.all([getUserData(), getWallet()]);
        setUserData(user);
        setWalletData(walletData);
        console.log("User Data:", user);
        console.log("Wallet Data:", walletData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
            <Text>Vous n'avez pas de wallet Connecté</Text>
            <Button variant="light">Ajouter un wallet</Button>
          </Stack>
        </Flex>
      )}
    </Card>
    </Stack>
  );
}
