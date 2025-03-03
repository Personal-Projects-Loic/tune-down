import React from "react";
import { Product, Nft } from "../../types/nft";
import { Card, Text, Group, Image } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import classes from './ImageCard.module.css';

export const NewCard: React.FC<Product> = ({ id, url, name, price }) => {
  const navigate = useNavigate();

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      onClick={() => navigate(`/nft/${id}`, { state: { id, url, name, price } })}
    >
      <Card.Section>
        <Image src={url} alt={name} fit="contain" className={classes.image} />
      </Card.Section>
      <Group style={{ position: "absolute", bottom: 0, width: "100%", height: "10%" }}>
        <Group justify="space-between">
          <Text size="lg" >
            {name}
          </Text>
          <Text size="sm" className={classes.hoverGroup}>
            {price} ETH
          </Text>
        </Group>
      </Group>
    </Card>
  );
};

export const NftCard: React.FC<Nft> = ({ nft_infos, price, user }) => {
  const navigate = useNavigate();

  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      onClick={() => navigate(`/nft/${nft_infos.id}`, { state: { nft_infos, price, user } })}
      
    >
      <Card.Section>
        <Image bg={"gray"} src={nft_infos.uri} alt={nft_infos.id} className={classes.image} />
      </Card.Section>
      <Group style={{ position: "absolute", bottom: 0, width: "100%", height: "10%" }}>
        <Group justify="space-between">
          <Text size="lg" >
            {user.username}
          </Text>
        </Group>
      </Group>
    </Card>
  );
}