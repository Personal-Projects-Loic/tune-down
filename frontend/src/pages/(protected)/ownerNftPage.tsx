import { useState, useEffect } from "react";
import { Nft } from "../../types/nft";
import { NftOffer } from "../../types/nftOffer";
import { useLocation } from "react-router-dom";
import { Stack, Card, Tabs, Grid, Text, Button, Image, Divider, Group, Anchor } from "@mantine/core";
import useWalletStore from "../../utils/store";
import { useDisclosure } from "@mantine/hooks";
import { CreateSellOfferModal, newSellOfferModal } from "../../components/nfts/modals/createSellOfferModal";
import { getBuyOffers } from "../../api/nft/getBuyOffers";

export default function OwnerNftPage() {
  const location = useLocation();
  const nft = location.state?.nft as Nft | undefined;
  const { wallet } = useWalletStore();
  const [newSelOffer, setNewSellOffer] = useState<newSellOfferModal | null>(null);
  const [buyOffers, setBuyOffers] = useState<NftOffer[] | null>(null);
  const [updateModal, { 
    open: openUpdateModal,
    close: closeUpdateModal 
  }] = useDisclosure(false);

  if (!nft) {
    return <h2>No item found</h2>;
  }

  const fetchData = async () => {
    const Offers = await getBuyOffers(nft.nft_infos.id);
    setBuyOffers(Offers);
  };

  useEffect(() => {
    if (nft) {
      fetchData();
    }
  }, []);

  return (
    <Stack align="center">
      <Text>Owner NFT Page</Text>
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
              <Button 
                variant="light"
                disabled={!wallet}
                onClick={openUpdateModal}
              >Mettre en vente</Button>
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
      <CreateSellOfferModal
        nft={nft}
        isOpen={updateModal}
        onClose={closeUpdateModal}
      />
    </Stack>
  );
}