import { useState, useEffect } from "react";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Stack, Title, Card, Group, NumberInput, SimpleGrid, Textarea, TextInput, PasswordInput, Autocomplete, Text, Button, Space, Image, Anchor } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { Wallet } from "../../types/wallet";
import { addNft } from "../../api/nft/addNft";
import { getWallet } from "../../api/wallet/getWallet";
import { newNFT } from "../../types/nft";


export const uploadPicture = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/images/upload_picture", {
      method: "POST",
      credentials: "include",
      mode: "cors",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de l'image");
    }

    const data = await response.json();
    console.log("Image envoyée avec succès :", data);
    return data.url;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default function CreateNft() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [wallet, setWalletData] = useState<Wallet | null>(null);
  const [secretKey, setSecretKey] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [nft, setNft] = useState<newNFT>({
    name: "",
    description: "",
    price: 0,
    collection: "",
    image:  null 
  });
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletData = await getWallet();
        setWalletData(walletData);
        console.log("Wallet Data:", walletData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDrop = (files: FileWithPath[]): void => {
    // Get the first file
    const droppedFile = files[0];
    
    // Save the file for later upload
    setNft({...nft, image: droppedFile});
    
    // Create a preview URL for the file
    const url = URL.createObjectURL(droppedFile);
    setImageUrl(url);
  };

  const handleNewNft = async () => {

    if (nft.image === null) {
      console.error("No image uploaded");
      return;
    }

    // Use the actual file object that was saved when dropped
    setLoading(true);
    const data = await addNft(nft, secretKey);

    if (data === null) {
      console.log("Error creating NFT");
      setErrorMessage("Erreur lors de la création du NFT");
      setLoading(false);

      return;
    }
    setLoading(false);
    setErrorMessage(null);
    console.log("NFT created");
    
    // Additional logic to handle the newly created NFT could go here
    // For example, collecting form data and sending it to another API
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
            onChange={(e) => setNft({...nft, name: e.currentTarget.value})}
          />
          <Autocomplete
            label="Collection du nft"
            placeholder="Pick value or enter anything"
            data={['pokemon', 'cb', 'donneur d\'organe', 'yo gy yo']}
            required
            onChange={(value) => setNft({...nft, collection: value})}
          />
          <NumberInput
            label="Prix du NFT"
            placeholder="Prix de ton NFT"
            defaultValue={1}
            required
            onChange={(value) => setNft({...nft, price: typeof value === 'number' ? value : 0})}
          />
          <NumberInput
            label="Quantité du NFT"
            placeholder="Quantité de ton NFT"
            defaultValue={1}
          
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
          onChange={(e) => setSecretKey(e.currentTarget.value)}
        />
        <Space h="lg" />
        <Button color="blue" disabled={!wallet} onClick={() => handleNewNft()} loading={loading}>Créer le NFT</Button>
        {wallet != null ? <Text></Text> : <Text size="sm" c="dimmed" mt="sm">Vous devez être connecté à votre wallet pour créer un NFT <Anchor href="/profil">Ajouter un wallet</Anchor></Text>}
        {errorMessage && <Text color="red" size="sm">{errorMessage}</Text>}
      </Card> 
    </Stack>
  );
}
