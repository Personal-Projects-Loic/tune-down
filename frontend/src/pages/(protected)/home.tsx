import { NftCard } from "../../components/nfts/nftCard";
import { Stack, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { listNft } from "../../api/nft/listNft";
import { Nft } from "../../types/nft";
import { notify } from "../../utils/notify";

export default function NewHome() {
  const [nftData, setNftData] = useState<Nft[] | null>([]);
  
  const fetchData = async () => {
    try {
      const nftData = await listNft();
      setNftData(nftData);
      console.log("NFT Data:", nftData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
    notify({title: "Bienvenue", message: "Bienvenue sur la page d'accueil", type: "info"});
  }, []);

  return (
    <Stack align="center">
      <SimpleGrid cols={6} spacing="xl">
        {nftData ? (
          nftData.length > 0 ?
          nftData.map((nft, index) => (
            <div>
              <NftCard
                key={index}
                nft_infos={nft.nft_infos}
                price={nft.price}
                user={nft.user}
              />
            </div>
          ))
          : <Text>Aucune Nft à afficher</Text>
        ) : <Text>loading</Text>}
      </SimpleGrid>
    </Stack>
  )
}