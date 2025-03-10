import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  PasswordInput,
} from "@mantine/core";
import { newOfferModal } from "../../../types/nftOffer";
import { useState } from "react";

interface Props {
  title: string;
  isOpen: boolean;
  blueButtonText: string;
  onClose: () => void;
  setSellOffer: (sellOffer: newOfferModal | null) => void;
}

export function CreateOfferModal({ title, isOpen, blueButtonText, onClose, setSellOffer }: Props) {
  let price: string | number = 0;
  let privateKey = "";
  const [privateKeyError, setPrivateKeyError] = useState<string | null>(null);

  const handleSellOffer = async () => {
    console.log("price:", price);
    console.log("privateKey:", privateKey);
    if (!privateKey || privateKey === "") {
      console.log("privateKey is required");
      setPrivateKeyError("Clé privée requise");
      return;
    }
    setSellOffer({ price: Number(price), privateKey });
    onClose();
  }

  const handleCancel = () => {
    setSellOffer(null);
    onClose();
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      title={
        <Group gap="xs">
          <Text>{title}</Text>
        </Group>
      }
    >
      <Stack>
        <NumberInput
          label="Prix"
          placeholder="Prix"
          required
          min={0}
          max={100000}
          onChange={(value) => price = value}
        />
        <PasswordInput
          label="clé privée"
          placeholder="clé privée"
          required
          onChange={(e) => privateKey = e.currentTarget.value}
          error={privateKeyError}
        />
        <Group justify="center">
          <Button 
            color="red"
            variant="light"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button 
            color="blue"
            variant="light"
            onClick={handleSellOffer}
          >
            {blueButtonText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}