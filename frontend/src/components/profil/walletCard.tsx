import {
  Box,
  Button,
  Card,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { Wallet } from "../../types/wallet";

const WalletCard: React.FC<{
  wallet: Wallet | null, 
  createWalletClicked: Boolean,
  walletPublicKey: string,
  setWalletPublicKey: (value: string) => void,
  isLoading: boolean,
  handleAddWallet: () => void,
  setCreateWalletClicked: (value: boolean) => void,
}> = ({
  wallet,
  createWalletClicked,
  walletPublicKey,
  setWalletPublicKey,
  isLoading,
  handleAddWallet,
  setCreateWalletClicked,
}) => {
  return (
    <Card shadow="xs" withBorder>
      {wallet ? (
        <Flex align="center">
          <Box flex={1}>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Text key="address">Address : {wallet?.address ?? "Non renseigné"}</Text>
              <Text key="balance">Balance : {wallet?.balance ?? "Non renseigné"}</Text>
            </SimpleGrid>
          </Box>
        </Flex>
      ) : (
        <Flex justify="center" align="center" style={{ height: "100px" }}>
          <Stack align="center">
            {createWalletClicked ? (
                <>
                <TextInput
                  label="Clé publique"
                  placeholder="Clé publique"
                  required
                  value={walletPublicKey}
                  onChange={(e) => setWalletPublicKey(e.currentTarget.value)}
                />
                <Button
                  variant="light"
                  loading={isLoading}
                  onClick={handleAddWallet}
                  disabled={!walletPublicKey}
                >
                  {"Ajouter le Wallet"}
                </Button>
                </>
            ) :
              (
                <>
                  <Text>Vous n'avez pas de wallet Connecté</Text>
                  <Button variant="light"
                    onClick={() => {
                      window.open('https://xrpl.org/resources/dev-tools/xrp-faucets', '_blank', 'noopener,noreferrer')
                      setCreateWalletClicked(true)
                    }}
                  >Ajouter un wallet</Button>
                </>
              )
            }
          </Stack>
        </Flex>
      )}
    </Card>
  );
}

export default WalletCard;