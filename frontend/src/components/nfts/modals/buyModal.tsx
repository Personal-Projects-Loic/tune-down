import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  PasswordInput,
} from "@mantine/core";

export interface Props {
  title: string;
  isOpen: boolean;
  blueButtonText: string;
  onClose: () => void;
  setAcceptOffer: (acceptOffer: string | null) => void;
}

export function BuyNftModal({ title, isOpen, blueButtonText, onClose, setAcceptOffer }: Props) {
  let privateKey = "";

  const handleAcceptOffer = async () => {
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