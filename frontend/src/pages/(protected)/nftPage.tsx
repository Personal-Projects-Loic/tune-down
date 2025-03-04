import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Stack, Card, Tabs, Grid, Text, Button, Image, Divider, Group, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Product, Nft } from "../../types/nft";
import { getSellOffer } from "../../api/nft/getSellOffer";
import { NftOffer } from "../../types/nftOffer";
import useWalletStore from "../../utils/store";
import { CreateOfferModal } from "../../components/nfts/modals/createOfferModal";
import { newOfferModal } from "../../types/nftOffer";
import { createBuyOffer } from "../../api/nft/createBuyOffer";

export function NftPage() {
  const location = useLocation();
  const nft = location.state?.nft as Nft | undefined;
  const [sellOffer, setSellOffer] = useState<NftOffer | null>(null);
  const [newBuyOffer, setNewBuyOffer] = useState<newOfferModal | null>(null);

  const { wallet } = useWalletStore();
  const [offerModal, { 
      open: openOfferModal,
      close: closeOfferModal 
    }] = useDisclosure(false);


  const fetchData = async () => {
    try {
      const nftOffer = await getSellOffer(nft?.nft_infos.id ?? "");
      setSellOffer(nftOffer);
      console.log("wallet Data:", wallet);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  const buyData = async () => {
    console.log("New buy offer:", newBuyOffer);
    const buyOffer = await createBuyOffer({
      price: newBuyOffer?.price ?? 0,
      wallet_private_key: newBuyOffer?.privateKey ?? "",
      nft_id: nft?.nft_infos.id ?? "",
      nft_owner: nft?.nft_infos.owner ?? ""
    });

    console.log("Buy offer:", buyOffer);
  }

  useEffect(() => {
    if (nft) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (newBuyOffer) {
      buyData();
    }
  }, [newBuyOffer]);

  if (!nft) {
    return <h2>Erreur : Aucun NFT trouvé</h2>;
  }

  return (
    <Stack align="center">
      <Grid justify="center">
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
              <Button variant="light" disabled={!wallet || !sellOffer}>
                {sellOffer ? <Text>Acheter</Text> : <Text>Aucune offre de vente</Text>}
              </Button>
              <Button 
                variant="light"
                disabled={!wallet}
                onClick={openOfferModal}
              >Faire une offre</Button>
              {!wallet && <Text>Connectez-vous pour acheter ou faire une offre <Anchor href="/profil">Ajouter un wallet</Anchor></Text>}
            </Group>
          </Card>

          <Card shadow="xs" withBorder radius="md" mt="sm" h={200}>
            <Tabs defaultValue="description">
              <Tabs.List>
                <Tabs.Tab value="description">Description</Tabs.Tab>
                <Tabs.Tab value="details">Détails</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="description">
                <Text lineClamp={6}>Description du NFT...</Text>
              </Tabs.Panel>
              <Tabs.Panel value="details" pt="xs">
                <Text>Propriétaire: {nft.user.username}</Text>
                <Text>Créateur:</Text>
                <Text>Token ID: {nft.nft_infos.id}</Text>
                <Text>Royalties:</Text>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>
      </Grid>
      <CreateOfferModal
        title="Faire une offre sur ce NFT"
        isOpen={offerModal}
        blueButtonText="Valider l'offre"
        onClose={closeOfferModal}
        setSellOffer={setNewBuyOffer}
      />
    </Stack>
  );
}
