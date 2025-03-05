import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  PasswordInput,
} from "@mantine/core";
import { useState } from "react";

export enum offerStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export type offerAnswerType = {
  status: offerStatus;
  privateKey: string | null;
}

interface Props {
  offerPrice: number;
  isOpen: boolean;
  blueButtonText: string;
  onClose: () => void;
  setSellOffer: (sellOffer: offerAnswerType | null) => void;
}

export function AcceptOfferModal({ offerPrice, isOpen, blueButtonText, onClose, setSellOffer }: Props) {
  let privateKey = "";
  const [privateKeyError, setPrivateKeyError] = useState<string | null>(null);
  const handleAcceptOffer = async () => {
    if (!privateKey || privateKey === "") {
      console.log("privateKey is required");
      setPrivateKeyError("Clé privée requise");
      return;
    }
    console.log("privateKey:", privateKey);
    setSellOffer({ status: offerStatus.ACCEPTED, privateKey });
    onClose();
  }

  const handleCancel = () => {
    setSellOffer(null);
    onClose();
  }

  const rejectOffer = async () => {
    console.log("rejecting offer");
    setSellOffer({ status: offerStatus.REJECTED, privateKey: null });
    onClose();
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      title={
        <Group gap="xs">
          <Text>Accepter cette offre d'achat</Text>
        </Group>
      }
    >
      <Stack>
        <Text>Prix Proposé: {offerPrice} XRP</Text>
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
            onClick={rejectOffer}
          >
            Annuler
          </Button>
          <Button 
            color="blue"
            variant="light"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button 
            color="green"
            variant="light"
            onClick={handleAcceptOffer}
          >
            {blueButtonText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}