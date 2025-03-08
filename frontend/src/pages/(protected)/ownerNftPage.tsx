import { useState, useEffect, JSX } from "react";
import { Nft } from "../../types/nft";
import { useLocation } from "react-router-dom";
import { Stack, Card, Tabs, Grid, Text, Button, Image, Divider, Group, Anchor, Table } from "@mantine/core";
import useWalletStore from "../../utils/store";
import { useDisclosure } from "@mantine/hooks";
import { CreateOfferModal } from "../../components/nfts/modals/createOfferModal";
import { getBuyOffers } from "../../api/offers/getBuyOffers";
import { createSellOffer } from "../../api/offers/createSellOffer";
import { newOfferModal } from "../../types/nftOffer";
import { getSellOffer } from "../../api/offers/getSellOffer";
import { AcceptOfferModal, offerAnswerType } from "../../components/nfts/modals/acceptOfferModal";

export default function OwnerNftPage() {
  const location = useLocation();
  const nft = location.state?.nft as Nft | undefined;
  const { wallet } = useWalletStore();
  const [newSelOffer, setNewSellOffer] = useState<newOfferModal | null>(null);
  const [isOnSale, setIsOnSale] = useState<boolean>(false);
  const [buyOffers, setBuyOffers] = useState<JSX.Element[] | undefined>(undefined);
  const [offerModal, { 
    open: openOfferModal,
    close: closeOfferModal 
  }] = useDisclosure(false);
  const [buyOfferModal, {
    open: openBuyOfferModal,
    close: closeBuyOfferModal
  }] = useDisclosure(false);
  const [offerPrice, setOfferPrice] = useState<{price: number, id: string | null}>({price: 0, id: null});
  const [offerAnswer, setOfferAnswer] = useState<offerAnswerType | null>(null);
  
  if (!nft) {
    return <h2>No item found</h2>;
  }

  //annuler la mise en vente
  //afficher que l'nft est en vente
  const postBuyOfferAnswer = async () => {
    console.log("Offer answer:", offerAnswer);

    if (offerAnswer?.status === "ACCEPTED") {
      console.log("Accepting offer...");
    } else if (offerAnswer?.status === "REJECTED") {
      console.log("Rejecting offer...");
    }
  };


  const fetchData = async () => {
    const [Offers, sale] = await Promise.all([getBuyOffers(nft.nft_infos.id), getSellOffer(nft?.nft_infos.id)]);
    const rows = Offers?.map((offer) => (
      <Table.Tr key={offer.account} onClick={() => {
        setOfferPrice({price: offer.price, id: offer.nft_id});
        openBuyOfferModal();
      }}>
        <Table.Td>{offer.account}</Table.Td>
        <Table.Td>{offer.price}</Table.Td>
      </Table.Tr>
    ))
    setIsOnSale(sale ? sale.length > 0 : false);
    setBuyOffers(rows);
  };

  const sellData = async () => {
    const sellOffer = await createSellOffer({
      price: newSelOffer?.price ?? 0,
      wallet_private_key: newSelOffer?.privateKey ?? "",
      nft_id: nft.nft_infos.id
    });

    if (!sellOffer) {
      console.error("Error creating sell offer");
      return;
    }
    setIsOnSale(true);
    console.log("Sell offer:", sellOffer);
  }

  useEffect(() => {
    if (nft) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (newSelOffer) {
      console.log("New sell offer:", newSelOffer);
      sellData();
    }
  }, [newSelOffer]);

  useEffect(() => {
    if (offerAnswer) {
      postBuyOfferAnswer();
    }
  }, [offerAnswer]);

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
              {isOnSale ? <Button variant="light" disabled={!wallet}>Annuler la vente</Button> : <Button 
                variant="light"
                disabled={!wallet}
                onClick={openOfferModal}
              >Mettre en vente</Button>}
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
                <Text>Propriétaire: {nft.user?.username ?? "Unknown"}</Text>
                <Text>Créateur:</Text>
                <Text>Token ID: {nft.nft_infos.id}</Text>
                <Text>Royalties:</Text>
              </Tabs.Panel>
            </Tabs>
          </Card>
          <Card shadow="xs" withBorder radius="md" mt="sm" h={200} style={{ width: "100%" }}>
            <Table striped style={{ width: "100%" }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Account</Table.Th>
                  <Table.Th>Prix</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {buyOffers}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
      <CreateOfferModal
        title="Mettre en vente ce Nft"
        isOpen={offerModal}
        blueButtonText="Mettre en vente"
        onClose={closeOfferModal}
        setSellOffer={setNewSellOffer}
      />
      <AcceptOfferModal
        offerPrice={offerPrice.price}
        isOpen={buyOfferModal}
        blueButtonText="Accepter l'offre"
        onClose={closeBuyOfferModal}
        setSellOffer={setOfferAnswer}
      />
    </Stack>
  );
}