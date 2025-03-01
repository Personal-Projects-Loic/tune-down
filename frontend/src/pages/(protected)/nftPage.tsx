import { useState, useEffect } from "react";
import { Product, Nft } from "../../types/nft";
import { useLocation } from "react-router-dom";
import { Stack, Card, Tabs, Grid, Text, Button, Image, Divider, Group } from "@mantine/core";
import { getUserData } from "../../api/getUser";
import { User } from "../../types/user";

export default function TestNftPage() {
  
  const location = useLocation();
  const nft = location.state as Product;

  if (!nft) {
    return <h2>No item found</h2>;
  }

  return (
    <div style={styles.card} onClick={() => console.log(nft.name)}>
      <img src={nft.url} alt={nft.name} style={styles.image} />
      <div style={styles.overlay}>
        <h2 style={styles.text}>{nft.name}</h2>
        <p style={styles.text}>{nft.price}</p>
      </div>
    </div>
  );
};


export function NftPage() {
  const location = useLocation();
  const nft = location.state as Nft | undefined;
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData();
        setUserData(user);
        console.log("User Data:", user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
    console.log(userData);
  }, []);

  if (!nft) {
    return <h2>No item found</h2>;
  }

  return (
    <Stack align="center">
      <Grid justify="center">
        {/* Image du NFT */}
        <Grid.Col span={4} style={{ display: "flex", justifyContent: "center" }}>
          <Card w={1000} shadow="xs" withBorder>
            <Image src={nft.nft_infos.uri} alt={nft.nft_infos.id} fit="contain" />
          </Card>
        </Grid.Col>

        <Grid.Col span={4} ml={10} w={300}>
          <Card shadow="xs" withBorder radius="md">
            <Stack>
              <Text>Nom : {nft.nft_infos.id}</Text>
              <Text>Prix : {nft.price} €</Text>
            </Stack>
            <Divider my="sm" />
            <Group>
              <Button variant="light">Acheter</Button>
              <Button variant="light">Faire une offre</Button>
            </Group>
          </Card>

          {/* Onglets Description & Détails */}
          <Card shadow="xs" withBorder radius="md" mt="sm" h={200}>
            <Tabs defaultValue="description">
              <Tabs.List>
                <Tabs.Tab value="description">Description</Tabs.Tab>
                <Tabs.Tab value="details">Détails</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="description">
                <Text lineClamp={6} >"sddsjdsjkdsfjkdsjkdsjksdjjlsdjsdfjsdkjsdjksdfbjsdfbj;sdfbjsfbjsdfbjsdfkjsgbkjgsfhjsdfkjsfkhjfsdhjsdfjlhsdfhjlfdshjlsdfhjlsfhli"sddsjdsjkdsfjkdsjkdsjksdjjlsdjsdfjsdkjsdjksdfbjsdfbj;sdfbjsfbjsdfbjsdfkjsgbkjgsfhjsdfkjsfkhjfsdhjsdfjlhsdfhjlfdshjlsdfhjlsfhli</Text>
              </Tabs.Panel>
              <Tabs.Panel value="details" pt="xs">
                <Text>Proprietaire: </Text>
                <Text>créateur:</Text>
                <Text>Token ID:</Text>
                <Text>Royalties:</Text>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>
      </Grid>
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
