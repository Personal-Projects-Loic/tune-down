import React from "react";
import { Nft } from "../../types/nft";
import { Card, Text, Group, Image } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './ImageCard.module.css';
import { Wallet } from "../../types/wallet";

interface NftCardProps {
  nft: Nft;
  wallet: Wallet | null;
}

export const NftCard: React.FC<NftCardProps> = ({ nft, wallet }) => {
  const navigate = useNavigate();

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      onClick={() => {
        nft.nft_infos.owner == wallet?.address ? navigate(`/my-nft/${nft.nft_infos.id}`, { state: { nft } }) : navigate(`/nft/${nft.nft_infos.id}`, { state: { nft } });
      }}
    >
      <Card.Section>
        <Image bg={"gray"} src={nft.nft_infos.uri} alt={nft.nft_infos.id} className={classes.image} />
      </Card.Section>
      <Group style={{ position: "absolute", bottom: 0, width: "100%", height: "10%" }}>
        <Group justify="space-between">
          <Text size="lg">
            {nft.user.username}
          </Text>
        </Group>
      </Group>
    </Card>
  );
};
