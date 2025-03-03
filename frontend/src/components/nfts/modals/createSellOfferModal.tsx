import { Nft } from "../../../types/nft";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  NumberInput,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  TextInput,
  PasswordInput,
} from "@mantine/core";

export type newSellOfferModal = {
  price: number;
  privateKey: string;
}

interface Props {
  nft: Nft;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSellOfferModal({ nft, onClose, isOpen }: Props) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      centered
      title={
        <Group gap="xs">
          <Text>Mettre en vente ce Nft</Text>
        </Group>
      }
    >
      <Stack>
        <NumberInput
          label="Prix"
          placeholder="Prix"
          required
        />
        <PasswordInput
          label="clé privée"
          placeholder="clé privée"
          required
        />
      </Stack>
    </Modal>
  );
}