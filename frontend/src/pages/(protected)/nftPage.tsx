import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Stack,
  Card,
  Tabs,
  Grid,
  Text,
  Button,
  Image,
  Divider,
  Group,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Nft } from "../../types/nft";
import { getSellOffer } from "../../api/offers/getSellOffer";
import { NftOffer } from "../../types/nftOffer";

import useWalletStore from "../../utils/store";
import { CreateOfferModal } from "../../components/nfts/modals/createOfferModal";
import { newOfferModal, AcceptOfferRequest } from "../../types/nftOffer";
import { createBuyOffer } from "../../api/offers/createBuyOffer";
import { acceptOffer } from "../../api/offers/acceptOffer";
import { BuyNftModal } from "../../components/nfts/modals/buyModal";

export function NftPage() {
  const location = useLocation();
  const nft = location.state?.nft as Nft | undefined;
  const [sellOffer, setSellOffer] = useState<NftOffer[] | null>(null);
  const [newBuyOffer, setNewBuyOffer] = useState<newOfferModal | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const { wallet } = useWalletStore();
  const [offerModal, { open: openOfferModal, close: closeOfferModal }] =
    useDisclosure(false);
  const [buyModal, { open: openBuyModal, close: closeBuyModal }] =
    useDisclosure(false);

  const fetchData = async () => {
    try {
      const nftOffer = await getSellOffer(nft?.nft_infos.id ?? "");
      setSellOffer(nftOffer);
      console.log("wallet Data:", wallet);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  const postBuyOfferData = async () => {
    console.log("New buy offer:", newBuyOffer);
    const buyOffer = await createBuyOffer({
      price: newBuyOffer?.price ?? 0,
      wallet_private_key: newBuyOffer?.privateKey ?? "",
      nft_id: nft?.nft_infos.id ?? "",
      nft_owner: nft?.nft_infos.owner ?? "",
    });

    console.log("Buy offer:", buyOffer);
  };

  const postAcceptOffer = async () => {
    const acceptOfferData: AcceptOfferRequest = {
      nft_id: nft?.nft_infos.id ?? "",
      private_key: privateKey ?? "",
      sell_offer_id: sellOffer?.[0].offer_id,
    };

    console.log("Accept offer data:", acceptOfferData);
    const acceptOfferResponse = await acceptOffer(acceptOfferData);
    console.log("Accept offer response:", acceptOfferResponse);
  };

  useEffect(() => {
    if (nft) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (newBuyOffer) {
      postBuyOfferData();
    }
  }, [newBuyOffer]);

  useEffect(() => {
    if (privateKey) {
      postAcceptOffer();
    }
  }, [privateKey]);

  if (!nft) {
    return <h2>Erreur : Aucun NFT trouvé</h2>;
  }

  return (
    <Stack align="center">
      <Grid justify="center">
        <Grid.Col
          span={4}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Card w={1000} shadow="xs" withBorder>
            <Image
              src={nft.nft_infos.uri}
              alt={nft.nft_infos.id}
              fit="contain"
            />
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
                disabled={!wallet || !sellOffer}
                onClick={openBuyModal}
              >
                {sellOffer ? (
                  <Text>Acheter</Text>
                ) : (
                  <Text>Aucune offre de vente</Text>
                )}
              </Button>
              <Button
                variant="light"
                disabled={!wallet}
                onClick={openOfferModal}
              >
                Faire une offre
              </Button>
              {!wallet && (
                <Text>
                  Connectez-vous pour acheter ou faire une offre{" "}
                  <Anchor href="/profil">Ajouter un wallet</Anchor>
                </Text>
              )}
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
                <Text>Propriétaire: {nft.user?.username}</Text>
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
      <BuyNftModal
        title="Acheter ce NFT"
        isOpen={buyModal}
        blueButtonText="Acheter"
        onClose={closeBuyModal}
        setAcceptOffer={setPrivateKey}
      />
    </Stack>
  );
}
