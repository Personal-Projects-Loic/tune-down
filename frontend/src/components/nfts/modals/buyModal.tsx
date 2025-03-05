import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  PasswordInput,
} from "@mantine/core";
import { useState } from "react";


export interface Props {
  title: string;
  isOpen: boolean;
  blueButtonText: string;
  onClose: () => void;
  setAcceptOffer: (acceptOffer: string | null) => void;
}

export function BuyNftModal({ title, isOpen, blueButtonText, onClose, setAcceptOffer }: Props) {
  let privateKey = "";
  const [privateKeyError, setPrivateKeyError] = useState<string | null>(null);
  const handleAcceptOffer = async () => {
    if (!privateKey || privateKey === "") {
      console.log("privateKey is required");
      setPrivateKeyError("Clé privée requise");
      return;
    }
    setAcceptOffer(privateKey);
    onClose();
  }

  const handleCancel = () => {
    setAcceptOffer(null);
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
        <PasswordInput
          label="clé privée"
          placeholder="clé privée"
          required
          onChange={(e) => privateKey = e.currentTarget.value}
          error={privateKeyError}
        />
        <Group justify="center">
          <Button onClick={handleCancel} color="red" variant="light">
            Annuler
          </Button>
          <Button onClick={handleAcceptOffer} color="blue"  variant="light">
            {blueButtonText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

}