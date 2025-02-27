import { useState, useEffect } from "react";
import { getUserData } from "../../api/getUser";
import { getWallet } from "../../api/wallet/getWallet";
import { User } from "../../types/user";
import { Wallet } from "../../types/wallet";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Stack, Title, Card, Group, Flex, Avatar, NumberInput, SimpleGrid, Textarea, TextInput, PasswordInput, Autocomplete, Text, Button, Space, Image } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';


function NftDropzone () {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDrop = (files: FileWithPath[]): void => {
    // Get the first file (you can modify this to handle multiple files)
    const file = files[0];
    
    // Create a URL for the file
    const url = URL.createObjectURL(file);
    
    // Set the URL in state
    setImageUrl(url);
  };

  return (
    <Dropzone
      onDrop={handleDrop}
    >

    </Dropzone>
  )
}

export default function CreateNft() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleDrop = (files: FileWithPath[]): void => {
    // Get the first file (you can modify this to handle multiple files)
    const file = files[0];
    
    // Create a URL for the file
    const url = URL.createObjectURL(file);
    
    // Set the URL in state
    setImageUrl(url);
  };

  return (
    <Stack align="center">
      <Card shadow="xs" withBorder radius="md" w="40%">
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        {imageUrl ?
          <Image src={imageUrl} alt="Dropped image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        : 
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload size={52} color="var(--mantine-color-blue-6)" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto size={52} color="var(--mantine-color-dimmed)" stroke={1.5} />
          </Dropzone.Idle>
          <div>
            <Text size="xl" inline>
              Déposez une image pour votre NFT ici
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              le fichier ne doit pas depasser 5Mo
            </Text>
          </div>
        </Group>
}
      </Dropzone>      
      </Card>
      <Card shadow="xs" withBorder radius="md" w="40%">
        <Stack gap="lg">
          <Title order={2}>Informations du NFT</Title>

          <SimpleGrid cols={2}>
          <TextInput
            label="Nom du NFT"
            placeholder="Nom de ton NFT"
            required
          />
          <Autocomplete
            label="Collection du nft"
            placeholder="Pick value or enter anything"
            data={['pokemon', 'cb', 'donneur d\'organe', 'yo gy yo']}
          />
          <NumberInput
            label="Prix du NFT"
            placeholder="Prix de ton NFT"
            required
          />
          <NumberInput
            label="Quantité du NFT"
            placeholder="Quantité de ton NFT"
            defaultValue={1}
            required
          />
          </SimpleGrid>
          <Textarea
            label="Description du NFT"
            placeholder="Description de ton NFT"
          />
        </Stack>
      </Card>
      <Card shadow="xs" withBorder radius="md" w="40%">
        <PasswordInput
          label="Clé privée"
          placeholder="Entrez votre clé privée"
          required
        />
        <Space h="lg" />
        <Button color="blue">Créer le NFT</Button>

      </Card>
    </Stack>
  );
}
